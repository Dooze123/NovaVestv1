import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const getInvestmentPlans = async (status = 'active') => {
  try {
    const result = await query(
      `SELECT * FROM investment_plans 
       WHERE status = $1 
       ORDER BY created_at DESC`,
      [status]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting investment plans', error: error.message });
    throw error;
  }
};

export const getInvestmentPlanById = async (planId) => {
  try {
    const result = await query(
      'SELECT * FROM investment_plans WHERE id = $1',
      [planId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting investment plan', error: error.message });
    throw error;
  }
};

export const createInvestment = async (userId, planId, amount) => {
  try {
    const plan = await getInvestmentPlanById(planId);
    if (!plan) throw new Error('Investment plan not found');

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);
    const dailyProfit = plan.daily_profit_fixed || (amount * plan.daily_profit_percentage / 100);
    const totalProfit = dailyProfit * plan.duration_days;

    const result = await query(
      `INSERT INTO investments (
        id, user_id, investment_plan_id, amount, daily_profit, total_profit, status, start_date, end_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        uuidv4(),
        userId,
        planId,
        amount,
        dailyProfit,
        totalProfit,
        'active',
        startDate,
        endDate
      ]
    );

    logger.info({ 
      message: 'Investment created', 
      investmentId: result.rows[0].id, 
      userId, 
      amount 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error creating investment', error: error.message });
    throw error;
  }
};

export const getUserInvestments = async (userId) => {
  try {
    const result = await query(
      `SELECT i.*, p.plan_name, p.duration_days 
       FROM investments i
       JOIN investment_plans p ON i.investment_plan_id = p.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting user investments', error: error.message });
    throw error;
  }
};

export const processInvestmentROI = async (investmentId) => {
  try {
    const result = await query(
      `SELECT * FROM investments WHERE id = $1`,
      [investmentId]
    );

    const investment = result.rows[0];
    if (!investment) throw new Error('Investment not found');

    const now = new Date();
    const endDate = new Date(investment.end_date);

    if (now >= endDate) {
      // Investment completed
      await query(
        `UPDATE investments SET status = 'completed', completed_at = NOW() WHERE id = $1`,
        [investmentId]
      );
      return { status: 'completed' };
    }

    // Check if daily profit should be credited
    const lastCredit = investment.last_profit_credited ? new Date(investment.last_profit_credited) : new Date(investment.start_date);
    const timeDiff = now.getTime() - lastCredit.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff >= 1) {
      // Credit daily profit
      await query(
        `UPDATE investments 
         SET earned_profit = earned_profit + $1, 
             last_profit_credited = NOW(),
             days_completed = days_completed + 1
         WHERE id = $2`,
        [investment.daily_profit, investmentId]
      );

      logger.info({ message: 'Daily profit credited', investmentId });
      return { status: 'profit_credited', amount: investment.daily_profit };
    }

    return { status: 'pending' };
  } catch (error) {
    logger.error({ message: 'Error processing ROI', error: error.message });
    throw error;
  }
};
