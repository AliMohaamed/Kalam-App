import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/chat/Sidebar";
import ChatArea from "../components/chat/ChatArea";
import "../index.css";

const ChatPage = () => {
  const { authUser, logout } = useContext(AuthContext);
  
  const {
    users,
    selectedUser,
    isLoading,
    messages,
    handleUserSelect,
    handleSearch,
    handleSendMessage
  } = useChat(authUser);

  return (
    <div className="chat-container">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        onLogout={logout}
        isLoading={isLoading}
        onSearch={handleSearch}
      />
      
      <main className="chat-main">
        <ChatArea
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default ChatPage;
