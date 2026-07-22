import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { validateDeposit, handleValidationErrors } from '../../middleware/validation.js';
import { createDeposit, getDepositsByUser } from '../../models/deposit.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.post('/request', authMiddleware, validateDeposit, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.userId;

    // Validate amount
    const minDeposit = parseFloat(process.env.MIN_DEPOSIT || 1000);
    const maxDeposit = parseFloat(process.env.MAX_DEPOSIT || 1000000);

    if (amount < minDeposit || amount > maxDeposit) {
      return res.status(400).json({
        success: false,
        message: `Deposit must be between ₦${minDeposit} and ₦${maxDeposit}`
      });
    }

    const deposit = await createDeposit(userId, amount, paymentMethod);

    res.json({
      success: true,
      message: 'Deposit request submitted successfully',
      deposit: {
        id: deposit.id,
        amount: parseFloat(deposit.amount),
        paymentMethod: deposit.payment_method,
        status: deposit.status,
        createdAt: deposit.created_at
      }
    });
  } catch (error) {
    logger.error({ message: 'Error creating deposit', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to create deposit request',
      error: error.message
    });
  }
});

router.get('/my-deposits', authMiddleware, async (req, res) => {
  try {
    const deposits = await getDepositsByUser(req.user.userId);

    res.json({
      success: true,
      deposits: deposits.map(d => ({
        id: d.id,
        amount: parseFloat(d.amount),
        paymentMethod: d.payment_method,
        status: d.status,
        rejectionReason: d.rejection_reason,
        createdAt: d.created_at,
        approvedAt: d.approved_at
      }))
    });
  } catch (error) {
    logger.error({ message: 'Error fetching deposits', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deposits',
      error: error.message
    });
  }
});

export default router;
