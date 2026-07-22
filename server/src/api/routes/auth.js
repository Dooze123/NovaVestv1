import express from 'express';
import { generateToken } from '../../utils/auth.js';
import { createUser, getUserByTelegramId, updateUserLastLogin } from '../../models/user.js';
import { createNotification } from '../../models/notification.js';
import { validateTelegramAuth, handleValidationErrors } from '../../middleware/validation.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.post('/telegram', validateTelegramAuth, async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName, photoUrl } = req.body;

    let user = await getUserByTelegramId(telegramId);

    if (!user) {
      // Create new user
      user = await createUser(telegramId, {
        username,
        firstName,
        lastName,
        photoUrl,
        ipAddress: req.ip
      });

      // Create registration notification
      await createNotification(
        user.id,
        'registration',
        'Welcome to NovaVest! 🎉',
        'Your account has been created successfully. Start investing today!'
      );

      logger.info({ message: 'New user registered', userId: user.id, telegramId });
    } else {
      // Update last login
      await updateUserLastLogin(user.id);
    }

    const token = generateToken(telegramId, user.is_admin ? 'admin' : 'user');

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        referralCode: user.referral_code,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    logger.error({ message: 'Auth error', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

export default router;
