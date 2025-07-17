import React from 'react';

const UserAvatar = ({ 
  user, 
  size = 44, 
  showOnlineIndicator = true,
  className = "" 
}) => {
  const getAvatarUrl = (user) => {
    if (user.profilePicture) {
      return user.profilePicture;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=${size}`;
  };

  return (
    <div className={`user-avatar ${className}`}>
      <img
        src={getAvatarUrl(user)}
        alt={user.name}
        style={{ width: size, height: size }}
      />
      {showOnlineIndicator && <div className="online-indicator"></div>}
    </div>
  );
};

export default UserAvatar;
