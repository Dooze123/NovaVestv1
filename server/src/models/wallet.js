import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const getWallet = async (userId) => {
  try {
    const result = await query(
      'SELECT * FROM wallets WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting wallet', error: error.message });
    throw error;
  }
};

export const updateWalletBalance = async (userId, balanceType, amount) => {
  try {
    const wallet = await getWallet(userId);
    if (!wallet) throw new Error('Wallet not found');

    const balanceColumn = `${balanceType}_balance`;
    const newBalance = parseFloat(wallet[balanceColumn]) + parseFloat(amount);
    const newTotalBalance = parseFloat(wallet.total_balance) + parseFloat(amount);

    const result = await query(
      `UPDATE wallets SET ${balanceColumn} = $1, total_balance = $2, updated_at = NOW()
       WHERE user_id = $3
       RETURNING *`,
      [newBalance, newTotalBalance, userId]
    );

    logger.info({ 
      message: 'Wallet updated', 
      userId, 
      balanceType, 
      amount, 
      newBalance 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error updating wallet', error: error.message });
    throw error;
  }
};

export const createTransaction = async (userId, type, amount, status = 'completed', description = null) => {
  try {
    const wallet = await getWallet(userId);
    if (!wallet) throw new Error('Wallet not found');

    const result = await query(
      `INSERT INTO transactions (
        id, user_id, type, amount, previous_balance, new_balance, status, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        uuidv4(),
        userId,
        type,
        amount,
        wallet.total_balance,
        parseFloat(wallet.total_balance) + parseFloat(amount),
        status,
        description
      ]
    );

    logger.info({ 
      message: 'Transaction created', 
      transactionId: result.rows[0].id, 
      userId, 
      type, 
      amount 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error creating transaction', error: error.message });
    throw error;
  }
};

export const getTransactionHistory = async (userId, limit = 50, offset = 0) => {
  try {
    const result = await query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting transaction history', error: error.message });
    throw error;
  }
};
