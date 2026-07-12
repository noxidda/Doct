import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if clerk authentication is configured and requested
    const useClerk = process.env.USE_CLERK === 'true';
    let userId = 'usr_owner';
    let userEmail = 'owner@doct.com';
    let userRole = 'Owner';
    let userName = 'Arthur Bauhaus';

    if (useClerk) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No authorization token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.decode(token);
        if (decoded) {
          userId = decoded.sub;
          userEmail = decoded.email;
          userRole = decoded.role || 'Member';
          userName = decoded.name || decoded.email?.split('@')[0] || 'User';
        }
      } catch (err) {
        return res.status(401).json({ message: 'Invalid Clerk token verification' });
      }
    } else {
      // Fallback Mock Headers
      userId = req.headers['x-mock-user-id'] || 'usr_owner';
      userRole = req.headers['x-mock-user-role'] || 'Owner';
      userEmail = req.headers['x-mock-user-email'] || 'owner@doct.com';
      userName = req.headers['x-mock-user-name'] || 'Arthur Bauhaus';
    }

    req.user = {
      clerkId: userId,
      name: userName,
      email: userEmail,
      role: userRole
    };

    // Map to MongoDB ObjectId if DB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      let dbUser = await User.findOne({ clerkId: userId });
      if (!dbUser) {
        dbUser = await User.create({
          clerkId: userId,
          name: userName,
          email: userEmail,
          role: userRole
        });
      }
      req.user.id = dbUser._id.toString();
    } else {
      req.user.id = userId;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failure', error: error.message });
  }
};

// Role-based Access Control authorization checker helper
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized user access' });
    }
    
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient workspace permissions' });
    }
  };
};
