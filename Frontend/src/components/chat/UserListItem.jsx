import React from 'react';
import UserAvatar from './UserAvatar';

const UserListItem = ({ 
  user, 
  isSelected = false, 
  onClick,
  lastSeen = "2m",
  unreadCount = 0,
  isOnline = true 
}) => {
  const handleClick = () => {
    onClick?.(user);
  };

  return (
    <div
      className={`user-item ${isSelected ? "active" : ""}`}
      onClick={handleClick}
    >
      <UserAvatar user={user} size={44} showOnlineIndicator={isOnline} />
      
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-status">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
      
      <div className="user-meta">
        <span className="last-seen">{lastSeen}</span>
        {unreadCount > 0 && (
          <div className="unread-badge">{unreadCount}</div>
        )}
      </div>
    </div>
  );
};

export default UserListItem;
