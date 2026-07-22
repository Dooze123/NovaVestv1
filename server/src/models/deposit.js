import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const createDeposit = async (userId, amount, paymentMethod) => {
  try {
    const result = await query(
      `INSERT INTO deposits (id, user_id, amount, payment_method, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [uuidv4(), userId, amount, paymentMethod]
    );

    logger.info({ 
      message: 'Deposit created', 
      depositId: result.rows[0].id, 
      userId, 
      amount 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error creating deposit', error: error.message });
    throw error;
  }
};

export const getDepositsByUser = async (userId) => {
  try {
    const result = await query(
      `SELECT * FROM deposits WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting deposits', error: error.message });
    throw error;
  }
};

export const getDepositById = async (depositId) => {
  try {
    const result = await query(
      'SELECT * FROM deposits WHERE id = $1',
      [depositId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting deposit', error: error.message });
    throw error;
  }
};

export const approveDeposit = async (depositId, adminId) => {
  try {
    const deposit = await getDepositById(depositId);
    if (!deposit) throw new Error('Deposit not found');

    const result = await query(
      `UPDATE deposits 
       SET status = 'approved', approved_by_admin = $1, approved_at = NOW(), updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [adminId, depositId]
    );

    logger.info({ 
      message: 'Deposit approved', 
      depositId, 
      adminId, 
      amount: deposit.amount 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error approving deposit', error: error.message });
    throw error;
  }
};

export const rejectDeposit = async (depositId, adminId, reason) => {
  try {
    const result = await query(
      `UPDATE deposits 
       SET status = 'rejected', approved_by_admin = $1, rejection_reason = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [adminId, reason, depositId]
    );

    logger.info({ message: 'Deposit rejected', depositId, adminId });
    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error rejecting deposit', error: error.message });
    throw error;
  }
};

export const getPendingDeposits = async (limit = 50, offset = 0) => {
  try {
    const result = await query(
      `SELECT d.*, u.username, u.first_name, u.last_name 
       FROM deposits d
       JOIN users u ON d.user_id = u.id
       WHERE d.status = 'pending'
       ORDER BY d.created_at ASC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting pending deposits', error: error.message });
    throw error;
  }
};
