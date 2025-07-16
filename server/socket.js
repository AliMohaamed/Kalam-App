import jwt from 'jsonwebtoken';

// This function will initialize all socket.io logic.
// We pass the 'io' server instance to it.
const initializeSocket = (io) => {
  // --- Socket.io Middleware for Authentication ---
  // This runs for every incoming connection.
  io.use((socket, next) => {
    // Get the token from the handshake auth object.
    const token = socket.handshake.auth.token;
    if (!token) {
      // If no token, reject the connection.
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify the JWT.
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
      // If token is valid, attach the user payload to the socket object.
      socket.user = decoded;
      // Allow the connection.
      next();
    });
  });

  // --- Main Connection Handler ---
  // This runs after a client successfully passes the middleware and connects.
  io.on('connection', (socket) => {
    // The 'socket' object now has the user's info attached.
    console.log(`A user connected: ${socket.user.displayName} (${socket.id})`);

    // --- Event Listeners for this specific socket ---

    // Handle disconnection for this specific client.
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.displayName} (${socket.id})`);
    });

    // We will add more event listeners here later (e.g., for chat messages).
  });
};

export default initializeSocket;