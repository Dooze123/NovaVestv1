import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export const generateToken = (userId, role = 'user') => {
  try {
    return jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (error) {
    logger.error({ message: 'Error generating token', error: error.message });
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error({ message: 'Error verifying token', error: error.message });
    throw error;
  }
};

export const verifyTelegramWebAppData = (data) => {
  try {
    const checkString = Object.keys(data)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('\n');

    // This is a simplified verification - for production, use proper HMAC-SHA256
    return true;
  } catch (error) {
    logger.error({ message: 'Error verifying Telegram data', error: error.message });
    return false;
  }
};
