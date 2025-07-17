import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api.js';

export const useChat = (authUser) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/users");
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
  }, [authUser.id]);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user selection
  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
    // Here you would typically fetch messages for the selected user
    setMessages([]); // Reset messages when switching users
  }, []);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle sending messages
  const handleSendMessage = useCallback((messageContent) => {
    if (!selectedUser) return;

    const newMessage = {
      id: Date.now(),
      content: messageContent,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: authUser.id,
      receiverId: selectedUser.id
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Here you would typically send the message to the server via socket or API
    console.log('Sending message:', newMessage);
  }, [selectedUser, authUser.id]);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users: filteredUsers,
    selectedUser,
    isLoading,
    messages,
    handleUserSelect,
    handleSearch,
    handleSendMessage,
    refreshUsers: fetchUsers
  };
};
