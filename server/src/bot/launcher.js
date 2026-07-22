import bot from './index.js';
import logger from '../utils/logger.js';

// Launch bot
bot.launch();

logger.info('🤖 Telegram Bot started successfully');

// Handle graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
