import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { getUserNotifications, markNotificationAsRead } from '../../models/notification.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const notifications = await getUserNotifications(req.user.userId, limit, offset);

    res.json({
      success: true,
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.notification_type,
        title: n.title,
        message: n.message,
        data: n.data ? JSON.parse(n.data) : null,
        isRead: n.is_read,
        isImportant: n.is_important,
        createdAt: n.created_at
      })),
      limit,
      offset
    });
  } catch (error) {
    logger.error({ message: 'Error fetching notifications', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

router.patch('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    const notification = await markNotificationAsRead(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error({ message: 'Error marking notification as read', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

export default router;
