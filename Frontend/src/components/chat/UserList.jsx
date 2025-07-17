import React from 'react';
import { Users } from 'lucide-react';
import UserListItem from './UserListItem';

const UserList = ({ 
  users, 
  selectedUser, 
  onUserSelect, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <span>Loading contacts...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="empty-state">
        <Users size={48} />
        <h3>No contacts yet</h3>
        <p>Start by adding some friends to chat with!</p>
      </div>
    );
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          isSelected={selectedUser?.id === user.id}
          onClick={onUserSelect}
          unreadCount={Math.floor(Math.random() * 5)} // Mock unread count
        />
      ))}
    </div>
  );
};

export default UserList;
