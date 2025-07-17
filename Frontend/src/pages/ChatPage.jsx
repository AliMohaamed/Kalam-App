import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../services/api"; // Import our new api client
import {
  Search,
  Send,
  MoreVertical,
  LogOut,
  Users,
  MessageCircle,
  Smile,
  Paperclip,
  Phone,
  Video,
} from "lucide-react";
import "../index.css";
import { SocketContext } from "../context/SocketContext";

const ChatPage = () => {
  const { authUser, logout } = useContext(AuthContext); // Get logout from context
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const { socket } = useContext(SocketContext);

  // This effect will run once when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Use our apiClient to make an authenticated request
        const response = await apiClient.get("/users");
        // Filter out the current logged-in user from the list
        const otherUsers = response.data.filter(
          (user) => user.id !== authUser.id
        );
        setUsers(otherUsers);
        console.log("Fetched users:", otherUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [authUser.id]); // Re-run if authUser changes

  // Function to handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    if (currentMessage.trim() && selectedUser && socket) {
      // 1. Emit the message to the backend server
      socket.emit("sendMessage", {
        recipientId: selectedUser.id,
        message: currentMessage,
      });

      // 2. Optimistic UI Update: Add the message to our own chat window immediately
      const newMessage = {
        senderId: authUser.id,
        message: currentMessage,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 3. Clear the input field
      setCurrentMessage("");
    }
  };

 
  // This effect listens for incoming messages from the socket server
  useEffect(() => {
    console.log("Socket connected:", socket);
    if (socket) {
      const handleReceiveMessage = (newMessage) => {
        // Only add the message to the state if it's from the currently selected user
        if (selectedUser && newMessage.senderId === selectedUser.id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      // Clean up the event listener when the component unmounts or selectedUser changes
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket, selectedUser]); // Re-run this effect if socket or selectedUser changes

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">
            <MessageCircle size={24} className="sidebar-icon" />
            <h2>Kalam</h2>
          </div>
          <div className="sidebar-actions">
            <button className="icon-btn" title="Logout" onClick={logout}>
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="search-input"
          />
        </div>

        {/* Contacts Section */}
        <div className="contacts-section">
          <div className="section-header">
            <Users size={18} />
            <span>Contacts</span>
            <span className="contact-count">{users.length}</span>
          </div>

          {/* User List */}
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
                  className={`user-item ${
                    selectedUser?.id === user.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="user-avatar">
                    <img
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${user.displayName}&background=667eea&color=fff`
                      }
                      alt={user.name}
                    />
                    <div className="online-indicator"></div>
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.displayName}</div>
                    <div className="user-status">Online</div>
                  </div>
                  <div className="user-meta">
                    <span className="last-seen">2m</span>
                    <div className="unread-badge">3</div>
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

      {/* Main Chat Area */}
      <main className="chat-main">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="chat-avatar">
                  <img
                    src={
                      selectedUser.profilePicture ||
                      `https://ui-avatars.com/api/?name=${selectedUser.name}&background=667eea&color=fff`
                    }
                    alt={selectedUser.name}
                  />
                  <div className="online-indicator"></div>
                </div>
                <div className="chat-user-details">
                  <h3>{selectedUser.name}</h3>
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

            {/* Chat Messages Area */}
            <div className="chat-messages">
              <div className="messages-container">
                {/* Sample messages for demonstration */}
                <div className="message-group">
                  <div className="message received">
                    <div className="message-content">
                      Hey there! How are you doing?
                    </div>
                    <div className="message-time">2:30 PM</div>
                  </div>
                  <div className="message received">
                    <div className="message-content">
                      I wanted to ask you about the project we discussed
                      yesterday.
                    </div>
                    <div className="message-time">2:31 PM</div>
                  </div>
                </div>

                <div className="message-group">
                  <div className="message sent">
                    <div className="message-content">
                      Hi! I'm doing great, thanks for asking! 😊
                    </div>
                    <div className="message-time">2:35 PM</div>
                  </div>
                  <div className="message sent">
                    <div className="message-content">
                      Sure! I've been working on it. Let me share the updates
                      with you.
                    </div>
                    <div className="message-time">2:35 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input Area - NOW FUNCTIONAL */}
            <form className="message-input-area" onSubmit={handleSendMessage}>
              <div className="input-container">
                <button type="button" className="attachment-btn" title="Attach File"><Paperclip size={20} /></button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="message-input"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button type="button" className="emoji-btn" title="Add Emoji"><Smile size={20} /></button>
                <button type="submit" className="send-btn" title="Send Message"><Send size={20} /></button>
              </div>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <MessageCircle size={64} />
            <h2>Welcome to Kalam</h2>
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
