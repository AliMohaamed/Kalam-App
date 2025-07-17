import Logo from "../ui/Logo.jsx";
import { LogOut, Users, MessageCircle } from "lucide-react";

const Sidebar = ({
  users,
  selectedUser,
  isLoading,
  userUnreadCounts,
  handleUserSelect,
  isMobileSidebarOpen,
  logout,
}) => (
  <aside className={`sidebar ${isMobileSidebarOpen ? "mobile-open" : ""}`}>
    <div className="sidebar-header">
      <div className="sidebar-title">
        <Logo size={50} color="white" />
      </div>
      <div className="sidebar-actions">
        <button className="icon-btn" title="Logout" onClick={logout}>
          <LogOut size={20} />
        </button>
      </div>
    </div>
    {/* Contacts Section */}
    <div className="contacts-section">
      <div className="section-header">
        <Users size={18} />
        <span>Contacts</span>
        <span className="contact-count">{users.length}</span>
      </div>
      <div className="user-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>Loading contacts...</span>
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="user-avatar">
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${user.displayName}&background=3b82f6&color=fff`
                  }
                  alt={user.displayName}
                />
                <div className="online-indicator"></div>
              </div>
              <div className="user-info">
                <div className="user-name">{user.displayName}</div>
                <div className="user-status">Online</div>
              </div>
              <div className="user-meta">
                {userUnreadCounts[user.id] > 0 && (
                  <div className="unread-badge">{userUnreadCounts[user.id]}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <h3>No contacts yet</h3>
            <p>Start by adding some friends to chat with!</p>
          </div>
        )}
      </div>
    </div>
  </aside>
);

export default Sidebar; 