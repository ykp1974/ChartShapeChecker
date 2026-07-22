import React, { useEffect } from 'react';

/**
 * Toast component that displays a message fixed at the bottom-left corner
 * and auto-closes after 5 seconds.
 * 
 * @param {Object} props
 * @param {string} props.message - The text message to display.
 * @param {function} props.onClose - Callback triggered when the toast closes or times out.
 */
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // 5秒間表示
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '20px', padding: '15px 25px',
      backgroundColor: '#16161a', color: '#e2e8f0', borderRadius: '12px',
      zIndex: 9999, border: '1px solid #2d2d35', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
      whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6'
    }}>
      {message}
    </div>
  );
};

export default Toast;
