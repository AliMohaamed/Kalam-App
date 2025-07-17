import React from 'react';
import { MessageCircle } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatArea = ({ selectedUser, messages, onSendMessage }) => {
  if (!selectedUser) {
    return (
      <div className="no-chat-selected">
        <MessageCircle size={64} />
        <h2>Welcome to Kalam</h2>
        <p>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <>
      <ChatHeader user={selectedUser} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </>
  );
};

export default ChatArea;
