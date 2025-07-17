import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

// 1. Create the context
export const SocketContext = createContext();

// 2. Create the provider component
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    // We only want to connect if there is an authenticated user
    if (authUser) {
      // Establish the connection to our backend server
      const newSocket = io('http://localhost:5000', {
        // Pass the JWT token for authentication in the handshake
        auth: {
          token: localStorage.getItem('kalam_token'),
        },
      });

      // Set the socket in our state
      setSocket(newSocket);

      // --- Cleanup function ---
      // This will run when the component unmounts (e.g., on logout)
      // to prevent memory leaks.
      return () => newSocket.close();
    } else {
      // If there is no user, close any existing connection
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]); // This effect re-runs whenever the authUser state changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};