import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import http from 'http';
import { Server } from 'socket.io';

// Import Passport configuration and routes
import initializePassport from './config/passport.js';

import startApp from './app.js';
import initializeSocket from './socket.js';

dotenv.config();

// Initialize services

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Initialize Passport config by passing the passport object to it
initializePassport(passport);
// Initialize Socket.io with the server instance
initializeSocket(io);


startApp(app, express);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});