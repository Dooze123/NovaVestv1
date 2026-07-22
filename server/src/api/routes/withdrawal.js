import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { validateWithdrawal, handleValidationErrors } from '../../middleware/validation.js';
import { createWithdrawal, getWithdrawalsByUser } from '../../models/withdrawal.js';
import { getWallet } from '../../models/wallet.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.post('/request', authMiddleware, validateWithdrawal, async (req, res) => {
  try {
    const { amount, withdrawalMethod, accountNumber, accountName, bankName } = req.body;
    const userId = req.user.userId;

    // Validate amount
    const minWithdrawal = parseFloat(process.env.MIN_WITHDRAWAL || 500);
    const maxWithdrawal = parseFloat(process.env.MAX_WITHDRAWAL || 500000);

    if (amount < minWithdrawal || amount > maxWithdrawal) {
      return res.status(400).json({
        success: false,
        message: `Withdrawal must be between ₦${minWithdrawal} and ₦${maxWithdrawal}`
      });
    }

    // Check balance
    const wallet = await getWallet(userId);
    if (parseFloat(wallet.main_balance) < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance for withdrawal'
      });
    }

    const withdrawal = await createWithdrawal(userId, amount, withdrawalMethod, {
      bankName,
      accountNumber,
      accountName
    });

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: withdrawal.id,
        amount: parseFloat(withdrawal.amount),
        withdrawalMethod: withdrawal.withdrawal_method,
        status: withdrawal.status,
        createdAt: withdrawal.created_at
      }
    });
  } catch (error) {
    logger.error({ message: 'Error creating withdrawal', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to create withdrawal request',
      error: error.message
    });
  }
});

router.get('/my-withdrawals', authMiddleware, async (req, res) => {
  try {
    const withdrawals = await getWithdrawalsByUser(req.user.userId);

    res.json({
      success: true,
      withdrawals: withdrawals.map(w => ({
        id: w.id,
        amount: parseFloat(w.amount),
        withdrawalMethod: w.withdrawal_method,
        bankName: w.bank_name,
        accountNumber: w.account_number,
        status: w.status,
        rejectionReason: w.rejection_reason,
        createdAt: w.created_at,
        approvedAt: w.approved_at,
        completedAt: w.completed_at
      }))
    });
  } catch (error) {
    logger.error({ message: 'Error fetching withdrawals', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawals',
      error: error.message
    });
  }
});

export default router;
