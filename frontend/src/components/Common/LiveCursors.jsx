import { useEffect, useRef } from 'react';
import useCollaboration from '../../hooks/useCollaboration';
import './LiveCursors.css';

/**
 * LiveCursors - Displays cursors of other users collaborating on the circuit
 */
const LiveCursors = ({ circuitId }) => {
  const { cursors, sendCursor } = useCollaboration(circuitId);
  const containerRef = useRef(null);
  const throttleTimeout = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      // Throttle cursor updates to avoid overwhelming the server
      if (throttleTimeout.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      sendCursor(x, y);

      throttleTimeout.current = setTimeout(() => {
        throttleTimeout.current = null;
      }, 50); // 20 updates per second max
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [sendCursor]);

  return (
    <div ref={containerRef} className="live-cursors-container">
      {Object.entries(cursors).map(([sid, cursor]) => (
        <div
          key={sid}
          className="remote-cursor"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            pointerEvents: 'none'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.65376 12.3673L13.9316 5.14479C14.8576 4.32483 16.2987 4.90368 16.4876 6.13516L17.5995 14.1702C17.7476 15.1192 16.9124 15.9044 15.9606 15.6963L12.6806 14.9915L9.86526 18.7452C9.25749 19.5745 8.01097 19.4712 7.55345 18.5286L5.63876 14.6738C5.38626 14.1416 5.36326 13.5291 5.65376 12.3673Z"
              fill={`hsl(${sid.charCodeAt(0) * 137}, 70%, 60%)`}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          <div className="cursor-label" style={{ backgroundColor: `hsl(${sid.charCodeAt(0) * 137}, 70%, 60%)` }}>
            {cursor.username}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveCursors;
