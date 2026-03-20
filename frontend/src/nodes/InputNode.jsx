import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export default function InputNode({ data }) {
  const [localPrompt, setLocalPrompt] = useState(data.prompt || '');

  const handleChange = (e) => {
    setLocalPrompt(e.target.value);
    data.onPromptChange(e.target.value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.icon}>✏️</span>
        <span style={styles.title}>Prompt</span>
      </div>
      <textarea
        className="nodrag nopan"
        style={styles.textarea}
        placeholder="Type your prompt here..."
        value={localPrompt}
        onChange={handleChange}
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        rows={4}
      />
      <Handle type="source" position={Position.Right} style={styles.handle} />
    </div>
  );
}

const styles = {
  container: {
    background: '#1e1e2e',
    border: '1.5px solid #7c3aed',
    borderRadius: '12px',
    padding: '16px',
    width: '280px',
    boxShadow: '0 0 20px rgba(124, 58, 237, 0.25)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  icon: { fontSize: '16px' },
  title: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#a78bfa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  textarea: {
    width: '100%',
    background: '#2a2a3e',
    border: '1px solid #3d3d5c',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
    padding: '10px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    cursor: 'text',
  },
  handle: {
    background: '#7c3aed',
    width: '12px',
    height: '12px',
    border: '2px solid #a78bfa',
  },
};
