import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { validateInvestment, handleValidationErrors } from '../../middleware/validation.js';
import { getInvestmentPlans, createInvestment, getUserInvestments } from '../../models/investment.js';
import { getWallet, updateWalletBalance, createTransaction } from '../../models/wallet.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.get('/plans', async (req, res) => {
  try {
    const plans = await getInvestmentPlans('active');

    res.json({
      success: true,
      plans: plans.map(p => ({
        id: p.id,
        name: p.plan_name,
        description: p.description,
        minimumAmount: parseFloat(p.minimum_amount),
        maximumAmount: p.maximum_amount ? parseFloat(p.maximum_amount) : null,
        dailyProfitPercentage: parseFloat(p.daily_profit_percentage),
        dailyProfitFixed: p.daily_profit_fixed ? parseFloat(p.daily_profit_fixed) : null,
        durationDays: p.duration_days,
        roiPercentage: p.roi_percentage ? parseFloat(p.roi_percentage) : null,
        riskLevel: p.risk_level,
        createdAt: p.created_at
      }))
    });
  } catch (error) {
    logger.error({ message: 'Error fetching investment plans', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment plans',
      error: error.message
    });
  }
});

router.get('/my-investments', authMiddleware, async (req, res) => {
  try {
    const investments = await getUserInvestments(req.user.userId);

    res.json({
      success: true,
      investments: investments.map(i => ({
        id: i.id,
        planName: i.plan_name,
        amount: parseFloat(i.amount),
        dailyProfit: parseFloat(i.daily_profit),
        totalProfit: parseFloat(i.total_profit),
        earnedProfit: parseFloat(i.earned_profit),
        status: i.status,
        startDate: i.start_date,
        endDate: i.end_date,
        daysCompleted: i.days_completed,
        durationDays: i.duration_days,
        createdAt: i.created_at,
        completedAt: i.completed_at
      }))
    });
  } catch (error) {
    logger.error({ message: 'Error fetching investments', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investments',
      error: error.message
    });
  }
});

router.post('/create', authMiddleware, validateInvestment, async (req, res) => {
  try {
    const { planId, amount } = req.body;
    const userId = req.user.userId;

    // Check wallet balance
    const wallet = await getWallet(userId);
    if (parseFloat(wallet.main_balance) < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Create investment
    const investment = await createInvestment(userId, planId, amount);

    // Deduct from wallet
    await updateWalletBalance(userId, 'main', -amount);
    await createTransaction(userId, 'investment', amount, 'completed', `Investment in plan: ${investment.plan_name}`);

    res.json({
      success: true,
      message: 'Investment created successfully',
      investment: {
        id: investment.id,
        amount: parseFloat(investment.amount),
        dailyProfit: parseFloat(investment.daily_profit),
        totalProfit: parseFloat(investment.total_profit),
        status: investment.status,
        startDate: investment.start_date,
        endDate: investment.end_date
      }
    });
  } catch (error) {
    logger.error({ message: 'Error creating investment', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to create investment',
      error: error.message
    });
  }
});

export default router;
