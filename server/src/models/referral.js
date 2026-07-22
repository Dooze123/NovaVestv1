import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const getUserReferralCode = async (userId) => {
  try {
    const result = await query(
      'SELECT referral_code FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0]?.referral_code || null;
  } catch (error) {
    logger.error({ message: 'Error getting referral code', error: error.message });
    throw error;
  }
};

export const createReferral = async (referrerId, referredUserId, referralCode = null) => {
  try {
    const result = await query(
      `INSERT INTO referrals (
        id, referrer_id, referred_user_id, referral_code, status, reward_status
      ) VALUES ($1, $2, $3, $4, 'pending', 'pending')
      RETURNING *`,
      [uuidv4(), referrerId, referredUserId, referralCode]
    );

    logger.info({ 
      message: 'Referral created', 
      referralId: result.rows[0].id, 
      referrerId, 
      referredUserId 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error creating referral', error: error.message });
    throw error;
  }
};

export const getUserReferrals = async (userId) => {
  try {
    const result = await query(
      `SELECT r.*, u.username, u.first_name, u.last_name 
       FROM referrals r
       JOIN users u ON r.referred_user_id = u.id
       WHERE r.referrer_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting referrals', error: error.message });
    throw error;
  }
};

export const creditReferralReward = async (referralId, amount) => {
  try {
    const result = await query(
      `UPDATE referrals 
       SET reward_status = 'completed', reward_credited_at = NOW(), updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [referralId]
    );

    logger.info({ message: 'Referral reward credited', referralId, amount });
    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error crediting referral reward', error: error.message });
    throw error;
  }
};

export const getReferralStats = async (userId) => {
  try {
    const result = await query(
      `SELECT 
        COUNT(*) as total_referrals,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_referrals,
        SUM(CASE WHEN reward_status = 'completed' THEN reward_amount ELSE 0 END) as total_earnings
       FROM referrals
       WHERE referrer_id = $1`,
      [userId]
    );

    return result.rows[0] || { total_referrals: 0, active_referrals: 0, total_earnings: 0 };
  } catch (error) {
    logger.error({ message: 'Error getting referral stats', error: error.message });
    throw error;
  }
};
