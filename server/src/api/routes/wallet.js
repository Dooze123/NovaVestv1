import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { getWallet, getTransactionHistory } from '../../models/wallet.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const wallet = await getWallet(req.user.userId);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      wallet: {
        id: wallet.id,
        mainBalance: parseFloat(wallet.main_balance),
        investmentBalance: parseFloat(wallet.investment_balance),
        referralBalance: parseFloat(wallet.referral_balance),
        taskBalance: parseFloat(wallet.task_balance),
        totalBalance: parseFloat(wallet.total_balance),
        totalDeposited: parseFloat(wallet.total_deposited),
        totalWithdrawn: parseFloat(wallet.total_withdrawn),
        totalEarned: parseFloat(wallet.total_earned),
        currency: wallet.currency
      }
    });
  } catch (error) {
    logger.error({ message: 'Error fetching wallet', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet',
      error: error.message
    });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await getTransactionHistory(req.user.userId, limit, offset);

    res.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        status: t.status,
        description: t.description,
        previousBalance: t.previous_balance ? parseFloat(t.previous_balance) : null,
        newBalance: t.new_balance ? parseFloat(t.new_balance) : null,
        createdAt: t.created_at,
        completedAt: t.completed_at
      })),
      limit,
      offset
    });
  } catch (error) {
    logger.error({ message: 'Error fetching transaction history', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history',
      error: error.message
    });
  }
});

export default router;
