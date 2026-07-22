import { verifyToken } from '../utils/auth.js';
import logger from '../utils/logger.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error({ message: 'Auth middleware error', error: error.message });
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id));
    const telegramId = parseInt(req.user?.telegramId);

    if (!adminIds.includes(telegramId)) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    logger.error({ message: 'Admin middleware error', error: error.message });
    res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
};
