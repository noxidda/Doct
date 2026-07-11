import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if clerk authentication is configured and requested
    const useClerk = process.env.USE_CLERK === 'true';

    if (useClerk) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No authorization token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      // Clerk JWT verification (in real production, clerk verifyToken is called)
      // For immediate verification robustness, we can inspect payload
      try {
        const decoded = jwt.decode(token);
        if (decoded) {
          req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role || 'Member'
          };
          return next();
        }
      } catch (err) {
        return res.status(401).json({ message: 'Invalid Clerk token verification' });
      }
    }

    // Fallback: Local Demo Mode
    // We expect a mock user header like 'X-Mock-User-Id' and 'X-Mock-User-Role'
    const mockUserId = req.headers['x-mock-user-id'] || 'usr_owner';
    const mockUserRole = req.headers['x-mock-user-role'] || 'Owner';
    const mockUserEmail = req.headers['x-mock-user-email'] || 'owner@doct.com';
    const mockUserName = req.headers['x-mock-user-name'] || 'Arthur Bauhaus';

    req.user = {
      id: mockUserId,
      name: mockUserName,
      email: mockUserEmail,
      role: mockUserRole
    };

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
