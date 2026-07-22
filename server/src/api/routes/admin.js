import express from 'express';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.js';
import { query } from '../../config/database.js';
import { approveDeposit, rejectDeposit, getPendingDeposits } from '../../models/deposit.js';
import { approveWithdrawal, rejectWithdrawal, getPendingWithdrawals } from '../../models/withdrawal.js';
import { verifyTaskCompletion, creditTaskReward } from '../../models/task.js';
import { updateWalletBalance, createTransaction } from '../../models/wallet.js';
import { createNotification } from '../../models/notification.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';

const router = express.Router();

// ============================================
// ADMIN USERS MANAGEMENT
// ============================================

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';

    const result = await query(
      `SELECT u.*, w.total_balance FROM users u 
       LEFT JOIN wallets w ON u.id = w.user_id
       WHERE u.first_name ILIKE $1 OR u.username ILIKE $1 OR CAST(u.telegram_id AS TEXT) LIKE $1
       ORDER BY u.created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    res.json({
      success: true,
      users: result.rows.map(u => ({
        id: u.id,
        telegramId: u.telegram_id,
        username: u.username,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        accountStatus: u.account_status,
        totalBalance: parseFloat(u.total_balance || 0),
        isAdmin: u.is_admin,
        createdAt: u.created_at
      })),
      limit,
      offset
    });
  } catch (error) {
    logger.error({ message: 'Error fetching users', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

router.patch('/users/:userId/ban', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    await query(
      'UPDATE users SET account_status = $1, updated_at = NOW() WHERE id = $2',
      ['banned', userId]
    );

    logger.info({ message: 'User banned', userId, adminId: req.user.userId });

    res.json({
      success: true,
      message: 'User banned successfully'
    });
  } catch (error) {
    logger.error({ message: 'Error banning user', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to ban user',
      error: error.message
    });
  }
});

router.patch('/users/:userId/unban', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    await query(
      'UPDATE users SET account_status = $1, updated_at = NOW() WHERE id = $2',
      ['active', userId]
    );

    logger.info({ message: 'User unbanned', userId, adminId: req.user.userId });

    res.json({
      success: true,
      message: 'User unbanned successfully'
    });
  } catch (error) {
    logger.error({ message: 'Error unbanning user', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to unban user',
      error: error.message
    });
  }
});

// ============================================
// ADMIN DEPOSITS MANAGEMENT
// ============================================

router.get('/deposits/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const deposits = await getPendingDeposits(limit, offset);

    res.json({
      success: true,
      deposits: deposits.map(d => ({
        id: d.id,
        userId: d.user_id,
        username: d.username,
        firstName: d.first_name,
        lastName: d.last_name,
        amount: parseFloat(d.amount),
        paymentMethod: d.payment_method,
        status: d.status,
        createdAt: d.created_at
      })),
      limit,
      offset
    });
  } catch (error) {
    logger.error({ message: 'Error fetching pending deposits', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending deposits',
      error: error.message
    });
  }
});

router.post('/deposits/:depositId/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { depositId } = req.params;
    const adminId = req.user.userId;

    const deposit = await approveDeposit(depositId, adminId);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: 'Deposit not found'
      });
    }

    // Update user wallet
    await updateWalletBalance(deposit.user_id, 'main', deposit.amount);
    await createTransaction(deposit.user_id, 'deposit', deposit.amount, 'completed', 'Deposit approved');

    // Send notification
    await createNotification(
      deposit.user_id,
      'deposit_approved',
      'Deposit Approved ✅',
      `Your deposit of ₦${deposit.amount} has been approved and credited to your wallet.`
    );

    res.json({
      success: true,
      message: 'Deposit approved successfully',
      deposit: {
        id: deposit.id,
        amount: parseFloat(deposit.amount),
        status: deposit.status,
        approvedAt: deposit.approved_at
      }
    });
  } catch (error) {
    logger.error({ message: 'Error approving deposit', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to approve deposit',
      error: error.message
    });
  }
});

router.post('/deposits/:depositId/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { depositId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.userId;

    const deposit = await rejectDeposit(depositId, adminId, reason);

    // Send notification
    await createNotification(
      deposit.user_id,
      'deposit_rejected',
      'Deposit Rejected ❌',
      `Your deposit of ₦${deposit.amount} has been rejected. Reason: ${reason}`
    );

    res.json({
      success: true,
      message: 'Deposit rejected successfully'
    });
  } catch (error) {
    logger.error({ message: 'Error rejecting deposit', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to reject deposit',
      error: error.message
    });
  }
});

// ============================================
// ADMIN WITHDRAWALS MANAGEMENT
// ============================================

router.get('/withdrawals/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const withdrawals = await getPendingWithdrawals(limit, offset);

    res.json({
      success: true,
      withdrawals: withdrawals.map(w => ({
        id: w.id,
        userId: w.user_id,
        username: w.username,
        firstName: w.first_name,
        lastName: w.last_name,
        amount: parseFloat(w.amount),
        withdrawalMethod: w.withdrawal_method,
        bankName: w.bank_name,
        accountNumber: w.account_number,
        status: w.status,
        createdAt: w.created_at
      })),
      limit,
      offset
    });
  } catch (error) {
    logger.error({ message: 'Error fetching pending withdrawals', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending withdrawals',
      error: error.message
    });
  }
});

router.post('/withdrawals/:withdrawalId/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const adminId = req.user.userId;

    const withdrawal = await approveWithdrawal(withdrawalId, adminId);

    // Update wallet and create transaction
    await updateWalletBalance(withdrawal.user_id, 'main', -withdrawal.amount);
    await createTransaction(withdrawal.user_id, 'withdrawal', withdrawal.amount, 'completed', 'Withdrawal approved');

    // Send notification
    await createNotification(
      withdrawal.user_id,
      'withdrawal_approved',
      'Withdrawal Approved ✅',
      `Your withdrawal request of ₦${withdrawal.amount} has been approved.`
    );

    res.json({
      success: true,
      message: 'Withdrawal approved successfully'
    });
  } catch (error) {
    logger.error({ message: 'Error approving withdrawal', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to approve withdrawal',
      error: error.message
    });
  }
});

router.post('/withdrawals/:withdrawalId/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.userId;

    const withdrawal = await rejectWithdrawal(withdrawalId, adminId, reason);

    // Send notification
    await createNotification(
      withdrawal.user_id,
      'withdrawal_rejected',
      'Withdrawal Rejected ❌',
      `Your withdrawal request of ₦${withdrawal.amount} has been rejected. Reason: ${reason}`
    );

    res.json({
      success: true,
      message: 'Withdrawal rejected successfully'
    });
  } catch (error) {
    logger.error({ message: 'Error rejecting withdrawal', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to reject withdrawal',
      error: error.message
    });
  }
});

// ============================================
// ADMIN TASKS MANAGEMENT
// ============================================

router.get('/tasks/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await query(
      `SELECT tc.*, t.task_name, t.reward_amount, u.username, u.first_name 
       FROM task_completions tc
       JOIN tasks t ON tc.task_id = t.id
       JOIN users u ON tc.user_id = u.id
       WHERE tc.status = 'submitted'
       ORDER BY tc.submitted_at ASC`
    );

    res.json({
      success: true,
      tasks: result.rows.map(tc => ({
        id: tc.id,
        userId: tc.user_id,
        username: tc.username,
        firstName: tc.first_name,
        taskId: tc.task_id,
        taskName: tc.task_name,
        rewardAmount: parseFloat(tc.reward_amount),
        status: tc.status,
        submittedAt: tc.submitted_at
      }))
    });
  } catch (error) {
    logger.error({ message: 'Error fetching pending tasks', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending tasks',
      error: error.message
    });
  }
});

router.post('/tasks/:taskCompletionId/verify', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { taskCompletionId } = req.params;
    const { approved } = req.body;
    const adminId = req.user.userId;

    const taskCompletion = await verifyTaskCompletion(taskCompletionId, adminId, approved);

    if (approved) {
      // Credit reward
      await updateWalletBalance(taskCompletion.user_id, 'task', taskCompletion.reward_amount);
      await createTransaction(taskCompletion.user_id, 'task_reward', taskCompletion.reward_amount, 'completed', 'Task reward');
      await creditTaskReward(taskCompletionId, taskCompletion.user_id);

      await createNotification(
        taskCompletion.user_id,
        'task_reward',
        'Task Verified ✅',
        `Your task has been verified. ₦${taskCompletion.reward_amount} has been credited to your wallet.`
      );
    } else {
      await createNotification(
        taskCompletion.user_id,
        'task_rejected',
        'Task Rejected ❌',
        'Your task submission could not be verified. Please check the instructions and try again.'
      );
    }

    res.json({
      success: true,
      message: `Task ${approved ? 'verified' : 'rejected'} successfully`
    });
  } catch (error) {
    logger.error({ message: 'Error verifying task', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to verify task',
      error: error.message
    });
  }
});

// ============================================
// ADMIN STATISTICS
// ============================================

router.get('/statistics', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await query('SELECT COUNT(*) as count FROM users');
    const activeUsers = await query("SELECT COUNT(*) as count FROM users WHERE account_status = 'active'");
    const totalDeposited = await query('SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE status = \'approved\'');
    const totalWithdrawn = await query('SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE status = \'approved\'');
    const pendingDeposits = await query("SELECT COUNT(*) as count FROM deposits WHERE status = 'pending'");
    const pendingWithdrawals = await query("SELECT COUNT(*) as count FROM withdrawals WHERE status = 'pending'");

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        activeUsers: parseInt(activeUsers.rows[0].count),
        totalDeposited: parseFloat(totalDeposited.rows[0].total),
        totalWithdrawn: parseFloat(totalWithdrawn.rows[0].total),
        pendingDeposits: parseInt(pendingDeposits.rows[0].count),
        pendingWithdrawals: parseInt(pendingWithdrawals.rows[0].count)
      }
    });
  } catch (error) {
    logger.error({ message: 'Error fetching statistics', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

export default router;
