import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import UserAvatar from './UserAvatar';

const ChatHeader = ({ user }) => {
  return (
    <div className="chat-header">
      <div className="chat-user-info">
        <UserAvatar 
          user={user} 
          size={48} 
          className="chat-avatar"
          showOnlineIndicator={true}
        />
        <div className="chat-user-details">
          <h3>{user.name}</h3>
          <span className="user-status">Online • Last seen 2m ago</span>
        </div>
      </div>
      
      <div className="chat-actions">
        <button className="icon-btn" title="Voice Call">
          <Phone size={20} />
        </button>
        <button className="icon-btn" title="Video Call">
          <Video size={20} />
        </button>
        <button className="icon-btn" title="More Options">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
