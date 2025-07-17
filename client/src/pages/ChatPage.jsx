import useChat from "../hooks/useChat.js";
import Sidebar from "../components/chat/Sidebar.jsx";
import ChatHeader from "../components/chat/ChatHeader.jsx";
import MessageList from "../components/chat/MessageList.jsx";
import MessageInput from "../components/chat/MessageInput.jsx";
import Logo from "./../components/ui/Logo.jsx"
import { Menu } from "lucide-react";

const ChatPage = () => {
  const {
    authUser,
    logout,
    users,
    selectedUser,
    isLoading,
    messages,
    currentMessage,
    setCurrentMessage,
    userUnreadCounts,
    isLoadingMessages,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isMobile,
    messagesEndRef,
    toggleMobileSidebar,
    handleUserSelect,
    handleBackToContacts,
    handleSendMessage,
  } = useChat();

  return (
    <div className="chat-container">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        isLoading={isLoading}
        userUnreadCounts={userUnreadCounts}
        handleUserSelect={handleUserSelect}
        isMobileSidebarOpen={isMobileSidebarOpen}
        logout={logout}
      />
      <main className="chat-main">
        {selectedUser ? (
          <>
            <ChatHeader
              selectedUser={selectedUser}
              isMobile={isMobile}
              handleBackToContacts={handleBackToContacts}
            />
            <MessageList
              messages={messages}
              authUser={authUser}
              isLoadingMessages={isLoadingMessages}
              messagesEndRef={messagesEndRef}
            />
            <MessageInput
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              handleSendMessage={handleSendMessage}
            />
          </>
        ) : (
          <div className="no-chat-selected">
            {isMobile && (
              <button
                className="icon-btn mobile-menu-btn"
                onClick={toggleMobileSidebar}
                title="Open contacts"
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  zIndex: 1001,
                  background: "var(--color-accent-primary)",
                  color: "white",
                }}
              >
                <Menu size={20} />
              </button>
            )}
            <Logo size={64} color="var(--color-accent-primary)" />
            <h2>Welcome to Kalam</h2>
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </main>
      {/* Mobile overlay for sidebar */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;
