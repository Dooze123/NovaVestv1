import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const createWithdrawal = async (userId, amount, withdrawalMethod, bankDetails = {}) => {
  try {
    const result = await query(
      `INSERT INTO withdrawals (
        id, user_id, amount, withdrawal_method, 
        bank_name, account_number, account_name, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *`,
      [
        uuidv4(),
        userId,
        amount,
        withdrawalMethod,
        bankDetails.bankName || null,
        bankDetails.accountNumber || null,
        bankDetails.accountName || null
      ]
    );

    logger.info({ 
      message: 'Withdrawal created', 
      withdrawalId: result.rows[0].id, 
      userId, 
      amount 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error creating withdrawal', error: error.message });
    throw error;
  }
};

export const getWithdrawalsByUser = async (userId) => {
  try {
    const result = await query(
      `SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting withdrawals', error: error.message });
    throw error;
  }
};

export const getWithdrawalById = async (withdrawalId) => {
  try {
    const result = await query(
      'SELECT * FROM withdrawals WHERE id = $1',
      [withdrawalId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting withdrawal', error: error.message });
    throw error;
  }
};

export const approveWithdrawal = async (withdrawalId, adminId) => {
  try {
    const withdrawal = await getWithdrawalById(withdrawalId);
    if (!withdrawal) throw new Error('Withdrawal not found');

    const result = await query(
      `UPDATE withdrawals 
       SET status = 'approved', approved_by_admin = $1, approved_at = NOW(), updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [adminId, withdrawalId]
    );

    logger.info({ 
      message: 'Withdrawal approved', 
      withdrawalId, 
      adminId 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error approving withdrawal', error: error.message });
    throw error;
  }
};

export const rejectWithdrawal = async (withdrawalId, adminId, reason) => {
  try {
    const result = await query(
      `UPDATE withdrawals 
       SET status = 'rejected', approved_by_admin = $1, rejection_reason = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [adminId, reason, withdrawalId]
    );

    logger.info({ message: 'Withdrawal rejected', withdrawalId, adminId });
    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error rejecting withdrawal', error: error.message });
    throw error;
  }
};

export const getPendingWithdrawals = async (limit = 50, offset = 0) => {
  try {
    const result = await query(
      `SELECT w.*, u.username, u.first_name, u.last_name 
       FROM withdrawals w
       JOIN users u ON w.user_id = u.id
       WHERE w.status = 'pending'
       ORDER BY w.created_at ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting pending withdrawals', error: error.message });
    throw error;
  }
};
