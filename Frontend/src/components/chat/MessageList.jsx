import { MessageCircle } from "lucide-react";

const MessageList = ({ messages, authUser, isLoadingMessages, messagesEndRef }) => (
  <div className="chat-messages">
    <div className="messages-container">
      {isLoadingMessages ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading messages...</span>
        </div>
      ) : messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`message-group ${msg.senderId === authUser.id ? "sent" : "received"}`}
          >
            <div
              className={`message ${msg.senderId === authUser.id ? "sent" : "received"}`}
            >
              <div className="message-content">{msg.content || msg.message}</div>
              <div className="message-time">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-messages">
          <MessageCircle size={48} />
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  </div>
);

export default MessageList; 