import { useState, useEffect, useContext, useRef } from "react";
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
  const [userUnreadCounts, setUserUnreadCounts] = useState({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

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
        content: currentMessage,
        createdAt: new Date().toISOString(),
        recipientId: selectedUser.id,
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
        } else {
          // If message is from a different user, increment their unread count
          setUserUnreadCounts((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      // Clean up the event listener when the component unmounts or selectedUser changes
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    // Function to fetch message history for the selected user
    const fetchMessages = async () => {
      // If no user is selected, clear messages and do nothing
      if (!selectedUser) {
        setMessages([]);
        return;
      }

      try {
        setIsLoadingMessages(true);
        const response = await apiClient.get(`/messages/${selectedUser.id}`);
        setMessages(response.data);
        console.log("messages:", response.data);

        // Clear unread count for selected user
        setUserUnreadCounts((prev) => ({
          ...prev,
          [selectedUser.id]: 0,
        }));
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // This effect marks messages as read when a chat is opened
  useEffect(() => {
    // Check if there are any unread messages from the selected user
    const unreadMessages = messages.filter(
      (msg) => !msg.read && msg.senderId === selectedUser?.id
    );

    if (socket && unreadMessages.length > 0) {
      socket.emit("markAsRead", {
        conversationId: unreadMessages[0].conversationId,
        senderId: selectedUser.id,
      });
    }
  }, [messages, selectedUser, socket]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
                    <span className="last-seen">2m</span>
                    {userUnreadCounts[user.id] > 0 && (
                      <div className="unread-badge">
                        {userUnreadCounts[user.id]}
                      </div>
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
                      selectedUser.image ||
                      `https://ui-avatars.com/api/?name=${selectedUser.displayName}&background=3b82f6&color=fff`
                    }
                    alt={selectedUser.displayName}
                  />
                  <div className="online-indicator"></div>
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

            {/* Chat Messages Area */}
            <div className="chat-messages">
              <div className="messages-container">
                {isLoadingMessages ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <span>Loading messages...</span>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} className="message-group">
                      <div
                        className={`message ${
                          msg.senderId === authUser.id ? "sent" : "received"
                        }`}
                      >
                        <div className="message-content">
                          {msg.content || msg.message}
                        </div>
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

            {/* Message Input Area - NOW FUNCTIONAL */}
            <form className="message-input-area" onSubmit={handleSendMessage}>
              <div className="input-container">
                <button
                  type="button"
                  className="attachment-btn"
                  title="Attach File"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="message-input"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <button type="button" className="emoji-btn" title="Add Emoji">
                  <Smile size={20} />
                </button>
                <button type="submit" className="send-btn" title="Send Message">
                  <Send size={20} />
                </button>
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
