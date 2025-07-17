import React from 'react';
import { Users } from 'lucide-react';
import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import UserList from './UserList';

const Sidebar = ({ 
  users, 
  selectedUser, 
  onUserSelect, 
  onLogout, 
  isLoading,
  onSearch 
}) => {
  return (
    <aside className="sidebar">
      <SidebarHeader onLogout={onLogout} />
      
      <SearchBar onSearch={onSearch} />
      
      <div className="contacts-section">
        <div className="section-header">
          <Users size={18} />
          <span>Contacts</span>
          <span className="contact-count">{users.length}</span>
        </div>
        
        <UserList
          users={users}
          selectedUser={selectedUser}
          onUserSelect={onUserSelect}
          isLoading={isLoading}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
