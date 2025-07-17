import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import apiClient from "../services/api";

const useChat = () => {
  const { authUser, logout } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userUnreadCounts, setUserUnreadCounts] = useState({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  // Mobile detection and responsive handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile sidebar when user is selected
  useEffect(() => {
    if (selectedUser && isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedUser, isMobile]);

  // Handle keyboard navigation for mobile
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isMobile) {
        if (event.key === "Escape" && isMobileSidebarOpen) {
          setIsMobileSidebarOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, isMobileSidebarOpen]);

  // Handle mobile sidebar toggle
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Handle user selection with mobile behavior
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Handle back to contacts on mobile
  const handleBackToContacts = () => {
    if (isMobile) {
      setSelectedUser(null);
      setIsMobileSidebarOpen(true);
    }
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/users");
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
  }, [authUser.id]);

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() && selectedUser && socket) {
      socket.emit("sendMessage", {
        recipientId: selectedUser.id,
        message: currentMessage,
      });
      const newMessage = {
        senderId: authUser.id,
        content: currentMessage,
        createdAt: new Date().toISOString(),
        recipientId: selectedUser.id,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setCurrentMessage("");
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (newMessage) => {
        if (selectedUser && newMessage.senderId === selectedUser.id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          setUserUnreadCounts((prev) => ({
            ...prev,
            [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
          }));
        }
      };
      socket.on("receiveMessage", handleReceiveMessage);
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket, selectedUser]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) {
        setMessages([]);
        return;
      }
      try {
        setIsLoadingMessages(true);
        const response = await apiClient.get(`/messages/${selectedUser.id}`);
        setMessages(response.data);
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

  // Mark messages as read
  useEffect(() => {
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

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return {
    authUser,
    logout,
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    messages,
    setMessages,
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
  };
};

export default useChat;
