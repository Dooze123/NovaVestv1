import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { getUserProfile, getUserById } from '../../models/user.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await getUserProfile(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegram_id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profile_photo,
        referralCode: user.referral_code,
        accountStatus: user.account_status,
        kycStatus: user.kyc_status,
        mainBalance: parseFloat(user.main_balance),
        investmentBalance: parseFloat(user.investment_balance),
        referralBalance: parseFloat(user.referral_balance),
        taskBalance: parseFloat(user.task_balance),
        totalBalance: parseFloat(user.total_balance),
        createdAt: user.created_at
      }
    });
  } catch (error) {
    logger.error({ message: 'Error fetching profile', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

export default router;
