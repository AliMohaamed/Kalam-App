import React from 'react';
import { MessageCircle, Settings, LogOut } from 'lucide-react';

const SidebarHeader = ({ onLogout }) => {
  return (
    <div className="sidebar-header">
      <div className="sidebar-title">
        <MessageCircle size={24} className="sidebar-icon" />
        <h2>Kalam</h2>
      </div>
      <div className="sidebar-actions">
        <button className="icon-btn" title="Settings">
          <Settings size={20} />
        </button>
        <button className="icon-btn" title="Logout" onClick={onLogout}>
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
