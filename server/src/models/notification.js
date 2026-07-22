import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const createNotification = async (userId, type, title, message, data = null) => {
  try {
    const result = await query(
      `INSERT INTO notifications (
        id, user_id, notification_type, title, message, data
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [uuidv4(), userId, type, title, message, data ? JSON.stringify(data) : null]
    );

    logger.info({ 
      message: 'Notification created', 
      notificationId: result.rows[0].id, 
      userId, 
      type 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error creating notification', error: error.message });
    throw error;
  }
};

export const getUserNotifications = async (userId, limit = 50, offset = 0) => {
  try {
    const result = await query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting notifications', error: error.message });
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const result = await query(
      `UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = $1 RETURNING *`,
      [notificationId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error marking notification as read', error: error.message });
    throw error;
  }
};
