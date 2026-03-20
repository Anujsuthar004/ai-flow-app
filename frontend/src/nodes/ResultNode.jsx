import { Handle, Position } from '@xyflow/react';

export default function ResultNode({ data }) {
  const isEmpty = !data.result && !data.loading;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.icon}>🤖</span>
        <span style={styles.title}>AI Response</span>
        {data.result && (
          <span style={styles.badge}>Done</span>
        )}
      </div>

      <div style={styles.resultBox}>
        {data.loading ? (
          <div style={styles.loading}>
            <span style={styles.dot} />
            <span style={styles.dot} />
            <span style={styles.dot} />
            <span style={{ marginLeft: '8px', color: '#94a3b8', fontSize: '13px' }}>
              Thinking...
            </span>
          </div>
        ) : isEmpty ? (
          <p style={styles.placeholder}>Response will appear here after you click Run Flow.</p>
        ) : (
          <p style={styles.resultText}>{data.result}</p>
        )}
      </div>

      <Handle type="target" position={Position.Left} style={styles.handle} />
    </div>
  );
}

const styles = {
  container: {
    background: '#1e1e2e',
    border: '1.5px solid #059669',
    borderRadius: '12px',
    padding: '16px',
    width: '320px',
    boxShadow: '0 0 20px rgba(5, 150, 105, 0.2)',
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
    color: '#34d399',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    flex: 1,
  },
  badge: {
    background: '#065f46',
    color: '#34d399',
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '99px',
    fontWeight: '600',
  },
  resultBox: {
    background: '#2a2a3e',
    border: '1px solid #3d3d5c',
    borderRadius: '8px',
    padding: '10px',
    minHeight: '80px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  placeholder: {
    color: '#4b5563',
    fontSize: '13px',
    fontStyle: 'italic',
    lineHeight: '1.5',
  },
  resultText: {
    color: '#e2e8f0',
    fontSize: '13px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0',
  },
  dot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#34d399',
    margin: '0 2px',
    animation: 'pulse 1.2s infinite ease-in-out',
  },
  handle: {
    background: '#059669',
    width: '12px',
    height: '12px',
    border: '2px solid #34d399',
  },
};
