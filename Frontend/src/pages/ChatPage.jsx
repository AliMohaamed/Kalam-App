import React from "react";
import "../index.css";

const ChatPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 300,
          background: "var(--color-bg-dark)",
          color: "var(--color-text-light)",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <div style={{ padding: "2rem 1rem", borderBottom: "1px solid var(--color-border)", fontWeight: 700, fontSize: "1.25rem" }}>
          Contacts
        </div>
        {/* User list placeholder */}
        <div style={{ flex: 1, padding: "1rem" }}>
          {/* User list will go here */}
        </div>
      </aside>
      {/* Main Chat Area */}
      <main
        style={{
          flex: 1,
          background: "var(--color-bg-light)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid var(--color-border)",
          fontWeight: 500,
          fontSize: "1.1rem",
          background: "#fff",
        }}>
          {/* Chat header placeholder */}
          Chat Header
        </div>
        {/* Chat messages area */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {/* Messages will go here */}
        </div>
        {/* Message input area */}
        <div style={{
          padding: "1rem 2rem",
          borderTop: "1px solid var(--color-border)",
          background: "#fff",
        }}>
          {/* Message input placeholder */}
          <input
            type="text"
            placeholder="Type a message..."
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: `1px solid var(--color-border)`,
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
