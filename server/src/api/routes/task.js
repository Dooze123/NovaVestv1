import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { getTasks, submitTaskCompletion, getUserTaskCompletions } from '../../models/task.js';
import { createNotification } from '../../models/notification.js';
import logger from '../../utils/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await getTasks('active');

    res.json({
      success: true,
      tasks: tasks.map(t => ({
        id: t.id,
        name: t.task_name,
        description: t.description,
        taskType: t.task_type,
        taskLink: t.task_link,
        rewardAmount: parseFloat(t.reward_amount),
        verificationType: t.verification_type,
        verificationInstructions: t.verification_instructions,
        createdAt: t.created_at
      }))
    });
  } catch (error) {
    logger.error({ message: 'Error fetching tasks', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
});

router.post('/submit/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    const taskCompletion = await submitTaskCompletion(userId, taskId);

    await createNotification(
      userId,
      'task_submitted',
      'Task Submitted ✅',
      'Your task submission has been received and is pending verification.'
    );

    res.json({
      success: true,
      message: 'Task submitted for verification',
      taskCompletion: {
        id: taskCompletion.id,
        taskId: taskCompletion.task_id,
        status: taskCompletion.status,
        rewardAmount: parseFloat(taskCompletion.reward_amount),
        submittedAt: taskCompletion.submitted_at
      }
    });
  } catch (error) {
    logger.error({ message: 'Error submitting task', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to submit task',
      error: error.message
    });
  }
});

router.get('/my-tasks', authMiddleware, async (req, res) => {
  try {
    const taskCompletions = await getUserTaskCompletions(req.user.userId);

    res.json({
      success: true,
      tasks: taskCompletions.map(tc => ({
        id: tc.id,
        taskId: tc.task_id,
        taskName: tc.task_name,
        status: tc.status,
        rewardAmount: parseFloat(tc.reward_amount),
        rewardCredited: tc.reward_credited,
        submittedAt: tc.submitted_at,
        verifiedAt: tc.verified_at,
        rewardCreditedAt: tc.reward_credited_at
      }))
    });
  } catch (error) {
    logger.error({ message: 'Error fetching user tasks', error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user tasks',
      error: error.message
    });
  }
});

export default router;
