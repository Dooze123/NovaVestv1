import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export const getTasks = async (status = 'active') => {
  try {
    const result = await query(
      `SELECT * FROM tasks WHERE status = $1 ORDER BY display_order ASC, created_at DESC`,
      [status]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting tasks', error: error.message });
    throw error;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const result = await query(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error({ message: 'Error getting task', error: error.message });
    throw error;
  }
};

export const submitTaskCompletion = async (userId, taskId) => {
  try {
    // Check if already completed
    const existing = await query(
      'SELECT * FROM task_completions WHERE user_id = $1 AND task_id = $2',
      [userId, taskId]
    );

    if (existing.rows.length > 0) {
      throw new Error('Task already completed by user');
    }

    const task = await getTaskById(taskId);
    if (!task) throw new Error('Task not found');

    const result = await query(
      `INSERT INTO task_completions (
        id, user_id, task_id, status, reward_amount
      ) VALUES ($1, $2, $3, 'submitted', $4)
      RETURNING *`,
      [uuidv4(), userId, taskId, task.reward_amount]
    );

    logger.info({ 
      message: 'Task completion submitted', 
      taskCompletionId: result.rows[0].id, 
      userId, 
      taskId 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error submitting task', error: error.message });
    throw error;
  }
};

export const getUserTaskCompletions = async (userId) => {
  try {
    const result = await query(
      `SELECT tc.*, t.task_name, t.reward_amount 
       FROM task_completions tc
       JOIN tasks t ON tc.task_id = t.id
       WHERE tc.user_id = $1
       ORDER BY tc.submitted_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    logger.error({ message: 'Error getting user task completions', error: error.message });
    throw error;
  }
};

export const verifyTaskCompletion = async (taskCompletionId, adminId, approved = true) => {
  try {
    const status = approved ? 'verified' : 'rejected';
    
    const result = await query(
      `UPDATE task_completions 
       SET status = $1, verified_by_admin = $2, verified_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, adminId, taskCompletionId]
    );

    logger.info({ 
      message: 'Task verification completed', 
      taskCompletionId, 
      status, 
      adminId 
    });

    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error verifying task', error: error.message });
    throw error;
  }
};

export const creditTaskReward = async (taskCompletionId, userId) => {
  try {
    const result = await query(
      `UPDATE task_completions 
       SET reward_credited = true, reward_credited_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [taskCompletionId]
    );

    logger.info({ message: 'Task reward credited', taskCompletionId, userId });
    return result.rows[0];
  } catch (error) {
    logger.error({ message: 'Error crediting task reward', error: error.message });
    throw error;
  }
};
