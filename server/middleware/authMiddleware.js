import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID from the token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

     

      // --- THIS IS THE NEW, IMPORTANT CHECK ---
      // If the user associated with the token is not found in the DB
      if (!user) {
        // Stop the request and send an authorization error
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach the found user to the request object
      req.user = user;

      // Call the next middleware in the stack
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };