import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';
import cryptoRandomString from 'crypto-random-string';

export const createUser = async (telegramId, userData) => {
  try {
    const referralCode = cryptoRandomString({ length: 10, type: 'alphanumeric' }).toUpperCase();
    
    const result = await query(
      `INSERT INTO users (
        id, telegram_id, username, first_name, last_name, 
        profile_photo, referral_code, ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        uuidv4(),
        telegramId,
        userData.username || null,
        userData.firstName,
        userData.lastName || null,
        userData.photoUrl || null,
        referralCode,
        userData.ipAddress || null
      ]
    );

    const user = result.rows[0];

    // Create wallet for user
    await query(
      `INSERT INTO wallets (id, user_id, main_balance, total_balance)
       VALUES ($1, $2, 0, 0)`,
      [uuidv4(), user.id]
    );

    logger.info({ message: 'User created', userId: user.id, telegramId });
    return user;
  } catch (error) {
    logger.error({ message: 'Error creating user', error: error.message });
    throw error;
  }
};

export const getUserByTelegramId = async (telegramId) => {
  try {
    const result = await query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting user', error: error.message });
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting user by ID', error: error.message });
    throw error;
  }
};

export const updateUserLastLogin = async (userId) => {
  try {
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [userId]
    );
  } catch (error) {
    logger.error({ message: 'Error updating last login', error: error.message });
  }
};

export const getUserProfile = async (userId) => {
  try {
    const result = await query(
      `SELECT u.*, w.main_balance, w.investment_balance, w.referral_balance, 
              w.task_balance, w.total_balance
       FROM users u
       LEFT JOIN wallets w ON u.id = w.user_id
       WHERE u.id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting user profile', error: error.message });
    throw error;
  }
};
