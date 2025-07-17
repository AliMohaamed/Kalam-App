import jwt from "jsonwebtoken";

// This object will act as a simple in-memory store
// to map user IDs to their active socket IDs.
const userSocketMap = {}; // { userId: socketId }

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
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify the JWT.
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      // If token is valid, attach the user payload to the socket object.
      socket.user = decoded;
      // Allow the connection.
      next();
    });
  });

  // --- Main Connection Handler ---
  // This runs after a client successfully passes the middleware and connects.
  io.on("connection", (socket) => {
    // The 'socket' object now has the user's info attached.
    const userId = socket.user.id;
    console.log(`A user connected: ${socket.user.displayName} (${socket.id})`);

    // Map the userId to their socketId
    userSocketMap[userId] = socket.id;

    console.log("User Socket Map:", userSocketMap);

    // --- NEW: Listen for chat messages ---
    socket.on("sendMessage", ({ recipientId, message }) => {
      console.log(
        `Message from ${socket.user.displayName} to ${recipientId}: ${message}`
      );

      // Find the recipient's socket ID from our map
      const recipientSocketId = userSocketMap[recipientId];
      console.log(
        `Recipient Socket ID: ${recipientSocketId}`
      );

      if (recipientSocketId) {
        // If the recipient is connected, send the message directly to them
        io.to(recipientSocketId).emit("receiveMessage", {
          senderId: userId,
          message: message,
        });
      }
      // Note: If the user is offline, you might want to save the message to the DB
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.displayName} (${socket.id})`);
      // Remove the user from our map on disconnect
      delete userSocketMap[userId];
    });

  });
};

export default initializeSocket;
