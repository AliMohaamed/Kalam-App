import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";

const ChatHeader = ({ selectedUser, isMobile, handleBackToContacts }) => (
  <div className="chat-header">
    {isMobile && (
      <button
        className="icon-btn mobile-back-btn"
        onClick={handleBackToContacts}
        title="Back to contacts"
        style={{ position: "absolute", left: "1rem", zIndex: 1001 }}
      >
        <ArrowLeft size={20} />
      </button>
    )}
    <div className="chat-user-info">
      <div className="chat-avatar">
        <img
          src={
            selectedUser.image ||
            `https://ui-avatars.com/api/?name=${selectedUser.displayName}&background=3b82f6&color=fff`
          }
          alt={selectedUser.displayName}
        />
      </div>
      <div className="chat-user-details">
        <h3>{selectedUser.displayName}</h3>
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

export default ChatHeader; 