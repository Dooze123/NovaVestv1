import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { getUserReferrals, getReferralStats } from '../../models/referral.js';
import { getUserReferralCode } from '../../models/referral.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.get('/code', authMiddleware, async (req, res) => {
  try {
    const referralCode = await getUserReferralCode(req.user.userId);

    res.json({
      success: true,
      referralCode,
      referralLink: `${process.env.TELEGRAM_APP_URL}?ref=${referralCode}`
    });
  } catch (error) {
    logger.error({ message: 'Error fetching referral code', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referral code',
      error: error.message
    });
  }
});

router.get('/my-referrals', authMiddleware, async (req, res) => {
  try {
    const referrals = await getUserReferrals(req.user.userId);
    const stats = await getReferralStats(req.user.userId);

    res.json({
      success: true,
      referrals: referrals.map(r => ({
        id: r.id,
        referredUsername: r.username,
        referredFirstName: r.first_name,
        referredLastName: r.last_name,
        status: r.status,
        rewardAmount: parseFloat(r.reward_amount),
        rewardStatus: r.reward_status,
        rewardCreditedAt: r.reward_credited_at,
        createdAt: r.created_at
      })),
      stats: {
        totalReferrals: parseInt(stats.total_referrals),
        activeReferrals: parseInt(stats.active_referrals),
        totalEarnings: parseFloat(stats.total_earnings || 0)
      }
    });
  } catch (error) {
    logger.error({ message: 'Error fetching referrals', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referrals',
      error: error.message
    });
  }
});

export default router;
