import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InputNode from './nodes/InputNode.jsx';
import ResultNode from './nodes/ResultNode.jsx';

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const initialEdges = [
  {
    id: 'e1-2',
    source: 'input-1',
    target: 'result-1',
    animated: true,
    style: { stroke: '#7c3aed', strokeWidth: 2 },
  },
];

export default function App() {
  const promptRef = useRef('');
  const [status, setStatus] = useState('');

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'input-1',
      type: 'inputNode',
      position: { x: 80, y: 180 },
      data: {
        prompt: '',
        onPromptChange: (val) => { promptRef.current = val; },
      },
    },
    {
      id: 'result-1',
      type: 'resultNode',
      position: { x: 500, y: 160 },
      data: { result: '', loading: false },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const updateResultNode = useCallback((result, loading) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === 'result-1' ? { ...n, data: { ...n.data, result, loading } } : n
      )
    );
  }, [setNodes]);

  const handleRunFlow = async () => {
    const prompt = promptRef.current;
    if (!prompt.trim()) {
      setStatus('Please enter a prompt first.');
      return;
    }
    setStatus('');
    updateResultNode('', true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      updateResultNode(data.answer, false);
    } catch (err) {
      updateResultNode('Error: ' + err.message, false);
    }
  };

  const handleSave = async () => {
    const prompt = promptRef.current;
    const resultNode = nodes.find((n) => n.id === 'result-1');
    const result = resultNode?.data?.result;

    if (!prompt.trim() || !result) {
      setStatus('Run the flow first before saving.');
      return;
    }
    setStatus('Saving...');
    try {
      const res = await fetch(`${BACKEND_URL}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, response: result }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setStatus('Saved to MongoDB!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Save failed: ' + err.message);
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const loading = nodes.find((n) => n.id === 'result-1')?.data?.loading;
  const result = nodes.find((n) => n.id === 'result-1')?.data?.result;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>⚡</span>
          <span style={styles.appName}>AI Flow</span>
        </div>
        <div style={styles.controls}>
          {status && <span style={styles.status}>{status}</span>}
          <button
            style={{ ...styles.btn, ...styles.btnRun }}
            onClick={handleRunFlow}
            disabled={loading}
          >
            {loading ? 'Running...' : '▶ Run Flow'}
          </button>
          <button
            style={{ ...styles.btn, ...styles.btnSave }}
            onClick={handleSave}
            disabled={loading || !result}
          >
            💾 Save
          </button>
        </div>
      </div>

      <div style={styles.canvas}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
        >
          <Background color="#2a2a3e" gap={20} size={1} />
          <Controls style={{ background: '#1e1e2e', border: '1px solid #3d3d5c' }} />
          <MiniMap
            style={{ background: '#1e1e2e', border: '1px solid #3d3d5c' }}
            nodeColor="#7c3aed"
          />
        </ReactFlow>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#0f0f1a',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: '#13131f',
    borderBottom: '1px solid #2a2a3e',
    zIndex: 10,
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: { fontSize: '22px' },
  appName: {
    fontWeight: '700',
    fontSize: '18px',
    background: 'linear-gradient(90deg, #a78bfa, #34d399)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  status: {
    fontSize: '13px',
    color: '#94a3b8',
    padding: '4px 12px',
    background: '#1e1e2e',
    borderRadius: '6px',
    border: '1px solid #3d3d5c',
  },
  btn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  },
  btnRun: {
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#fff',
  },
  btnSave: {
    background: 'linear-gradient(135deg, #059669, #047857)',
    color: '#fff',
  },
  canvas: {
    flex: 1,
  },
};
