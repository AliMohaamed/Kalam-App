import React from 'react';

const Message = ({ 
  message, 
  isSent = false, 
  timestamp,
  className = "" 
}) => {
  const messageType = isSent ? 'sent' : 'received';
  
  return (
    <div className={`message ${messageType} ${className}`}>
      <div className="message-content">
        {message}
      </div>
      <div className="message-time">
        {timestamp}
      </div>
    </div>
  );
};

export default Message;
