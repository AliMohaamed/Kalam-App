import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This object will act as a simple in-memory store (This is All users connected )
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
    socket.on("sendMessage", async ({ recipientId, message }) => {
      try {
        // --- NEW: Database Logic ---
        // 1. Find or create the conversation between the two users
        let conversation = await prisma.conversation.findFirst({
          where: {
            AND: [
              { participants: { some: { userId: userId } } },
              { participants: { some: { userId: recipientId } } },
            ],
          },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              participants: {
                create: [{ userId: userId }, { userId: recipientId }],
              },
            },
          });
          console.log("New conversation created");
        }

        // 2. Create the new message and link it to the conversation
        const newMessage = await prisma.message.create({
          data: {
            content: message,
            senderId: userId,
            recipientId: recipientId,
            conversationId: conversation.id,
          },
        });
        // --- Real-time Logic (as before) ---
        const recipientSocketId = userSocketMap[recipientId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", newMessage);
        }
      } catch (error) {
        console.error("Error handling sendMessage:", error);
      }
    });

    // --- NEW: Listen for when a user reads messages ---
    socket.on("markAsRead", async ({ conversationId, senderId }) => {
      try {
        // Update all messages in the conversation that were sent by the other user
        // and are directed to the current user.
        await prisma.message.updateMany({
          where: {
            conversationId: conversationId,
            senderId: senderId, // The other user
            recipientId: socket.user.id, // The current user
            read: false,
          },
          data: {
            read: true,
          },
        });

        // --- Notify the original sender that their messages were read ---
        // Find the sender's socket to notify them in real-time
        const senderSocketId = userSocketMap[senderId];
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesRead", { conversationId });
        }
      } catch (error) {
        console.error("Error in markAsRead:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(
        `User disconnected: ${socket.user.displayName} (${socket.id})`
      );
      // Remove the user from our map on disconnect
      delete userSocketMap[userId];
    });
  });
};

export default initializeSocket;
