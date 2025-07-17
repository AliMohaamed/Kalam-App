import React, { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

const MessageInput = ({ onSendMessage, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage?.(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-area">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <button 
            type="button" 
            className="attachment-btn" 
            title="Attach File"
          >
            <Paperclip size={20} />
          </button>
          
          <input
            type="text"
            placeholder={placeholder}
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <button 
            type="button" 
            className="emoji-btn" 
            title="Add Emoji"
          >
            <Smile size={20} />
          </button>
          
          <button 
            type="submit" 
            className="send-btn" 
            title="Send Message"
            disabled={!message.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
