import React from 'react';
import Message from './Message';

const MessageList = ({ messages = [] }) => {
  // Mock messages for demonstration
  const mockMessages = [
    {
      id: 1,
      content: "Hey there! How are you doing?",
      isSent: false,
      timestamp: "2:30 PM"
    },
    {
      id: 2,
      content: "I wanted to ask you about the project we discussed yesterday.",
      isSent: false,
      timestamp: "2:31 PM"
    },
    {
      id: 3,
      content: "Hi! I'm doing great, thanks for asking! 😊",
      isSent: true,
      timestamp: "2:35 PM"
    },
    {
      id: 4,
      content: "Sure! I've been working on it. Let me share the updates with you.",
      isSent: true,
      timestamp: "2:35 PM"
    }
  ];

  const displayMessages = messages.length > 0 ? messages : mockMessages;

  return (
    <div className="chat-messages">
      <div className="messages-container">
        <div className="message-group">
          {displayMessages.map((msg) => (
            <Message
              key={msg.id}
              message={msg.content}
              isSent={msg.isSent}
              timestamp={msg.timestamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
