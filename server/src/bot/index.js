import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';
import { getUserByTelegramId, createUser } from '../models/user.js';
import { createNotification } from '../models/notification.js';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ============================================
// START COMMAND - Welcome Menu
// ============================================
bot.start(async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await getUserByTelegramId(telegramId);

    const welcomeText = `
🎉 Welcome to NovaVest! 🎉

💰 The Ultimate Investment Platform

Hi ${ctx.from.first_name}! Start your investment journey today.

Tap a button below to get started:
    `;

    await ctx.reply(welcomeText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🏠 Home', callback_data: 'menu_home' }],
          [{ text: '💰 Wallet', callback_data: 'menu_wallet' }, { text: '📈 Invest', callback_data: 'menu_invest' }],
          [{ text: '💳 Deposit', callback_data: 'menu_deposit' }, { text: '💸 Withdraw', callback_data: 'menu_withdraw' }],
          [{ text: '👥 Referral', callback_data: 'menu_referral' }, { text: '✅ Tasks', callback_data: 'menu_tasks' }],
          [{ text: '🚀 Open Mini App', url: process.env.TELEGRAM_APP_URL }],
          [{ text: '⚙️ Settings', callback_data: 'menu_settings' }, { text: '🆘 Support', callback_data: 'menu_support' }]
        ]
      }
    });

    logger.info({ message: 'User started bot', telegramId });
  } catch (error) {
    logger.error({ message: 'Error in start command', error: error.message });
    ctx.reply('❌ An error occurred. Please try again.');
  }
});

// ============================================
// CALLBACK QUERIES - Menu Navigation
// ============================================
bot.action('menu_home', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.reply('🏠 Welcome to NovaVest Home!\n\nSelect an option from the menu to continue.');
  } catch (error) {
    logger.error({ message: 'Error in menu_home', error: error.message });
  }
});

bot.action('menu_wallet', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=wallet`;
    await ctx.reply(
      '💰 **Your Wallet**\n\nView your complete wallet balance and transaction history.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Open Wallet', url: miniAppURL }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_wallet', error: error.message });
  }
});

bot.action('menu_invest', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=investments`;
    await ctx.reply(
      '📈 **Investment Plans**\n\nExplore our investment plans and start earning daily profits.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'View Plans', url: miniAppURL }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_invest', error: error.message });
  }
});

bot.action('menu_deposit', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=deposit`;
    await ctx.reply(
      '💳 **Make a Deposit**\n\nFund your account to start investing.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Deposit Now', url: miniAppURL }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_deposit', error: error.message });
  }
});

bot.action('menu_withdraw', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=withdraw`;
    await ctx.reply(
      '💸 **Withdraw Funds**\n\nWithdraw your earnings to your bank account.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Withdraw', url: miniAppURL }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_withdraw', error: error.message });
  }
});

bot.action('menu_referral', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=referral`;
    await ctx.reply(
      '👥 **Referral Program**\n\nEarn ₦500 for each friend who makes their first deposit!',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'View Referral', url: miniAppURL }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_referral', error: error.message });
  }
});

bot.action('menu_tasks', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=tasks`;
    await ctx.reply(
      '✅ **Earn from Tasks**\n\nComplete tasks and earn instant rewards!',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'View Tasks', url: miniAppURL }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_tasks', error: error.message });
  }
});

bot.action('menu_settings', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=settings`;
    await ctx.reply(
      '⚙️ **Settings**\n\nManage your account preferences.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Open Settings', url: miniAppURL }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_settings', error: error.message });
  }
});

bot.action('menu_support', async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.reply(
      `
🆘 **Support**

📧 Email: support@novavest.com
💬 Telegram: @NovaVestSupport
🌐 Website: https://novavest.com

Our team is available 24/7 to help you!
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Contact Support', url: 'https://t.me/NovaVestSupport' }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in menu_support', error: error.message });
  }
});

// ============================================
// HELP COMMAND
// ============================================
bot.command('help', async (ctx) => {
  try {
    const helpText = `
🆘 **NovaVest Help & Commands**

/start - Show main menu
/balance - Check your balance
/referral - Get your referral code
/investments - View your investments
/help - Show this help message

💡 **Need Support?**
Use /support to get help or contact our team.
    `;
    await ctx.reply(helpText);
  } catch (error) {
    logger.error({ message: 'Error in help command', error: error.message });
  }
});

// ============================================
// BALANCE COMMAND
// ============================================
bot.command('balance', async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await getUserByTelegramId(telegramId);

    if (!user) {
      return ctx.reply('User not found. Please use /start first.');
    }

    const balanceText = `
💰 **Your Wallet Balance**

💵 Main Balance: ₦0.00
📈 Investment Balance: ₦0.00
👥 Referral Balance: ₦0.00
✅ Task Balance: ₦0.00

**Total Balance: ₦0.00**

View detailed wallet in the Mini App.
    `;

    await ctx.reply(balanceText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💳 Deposit', callback_data: 'menu_deposit' }],
          [{ text: '💸 Withdraw', callback_data: 'menu_withdraw' }],
          [{ text: '📈 Invest', callback_data: 'menu_invest' }]
        ]
      }
    });
  } catch (error) {
    logger.error({ message: 'Error in balance command', error: error.message });
    ctx.reply('❌ An error occurred. Please try again.');
  }
});

// ============================================
// REFERRAL COMMAND
// ============================================
bot.command('referral', async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await getUserByTelegramId(telegramId);

    if (!user) {
      return ctx.reply('User not found. Please use /start first.');
    }

    const referralText = `
👥 **Your Referral Link**

🎁 Earn ₦500 for each friend who completes their first deposit!

📱 Your Referral Code: ${user.referral_code}

🔗 Share your link and watch your earnings grow!
    `;

    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=referral&ref=${user.referral_code}`;

    await ctx.reply(referralText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'View Full Referral Dashboard', url: miniAppURL }],
          [{ text: '← Back', callback_data: 'menu_home' }]
        ]
      }
    });
  } catch (error) {
    logger.error({ message: 'Error in referral command', error: error.message });
    ctx.reply('❌ An error occurred. Please try again.');
  }
});

// ============================================
// INVESTMENTS COMMAND
// ============================================
bot.command('investments', async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await getUserByTelegramId(telegramId);

    if (!user) {
      return ctx.reply('User not found. Please use /start first.');
    }

    const miniAppURL = `${process.env.TELEGRAM_APP_URL}?page=investments`;

    const investText = `
📈 **Your Investments**

📊 View all your active investments and earnings.

Tap the button below to manage your investments.
    `;

    await ctx.reply(investText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'View Investments', url: miniAppURL }],
          [{ text: '← Back', callback_data: 'menu_home' }]
        ]
      }
    });
  } catch (error) {
    logger.error({ message: 'Error in investments command', error: error.message });
    ctx.reply('❌ An error occurred. Please try again.');
  }
});

// ============================================
// SUPPORT COMMAND
// ============================================
bot.command('support', async (ctx) => {
  try {
    await ctx.reply(
      `
🆘 **Support Center**

📧 Email: support@novavest.com
💬 Telegram: @NovaVestSupport
🌐 Website: https://novavest.com

Our team is available 24/7 to help you!
      `,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Contact Support', url: 'https://t.me/NovaVestSupport' }],
            [{ text: '← Back', callback_data: 'menu_home' }]
          ]
        }
      }
    );
  } catch (error) {
    logger.error({ message: 'Error in support command', error: error.message });
  }
});

// ============================================
// ERROR HANDLER
// ============================================
bot.catch((err, ctx) => {
  logger.error({ message: 'Bot error', error: err.message, userId: ctx.from?.id });
  ctx.reply('❌ An error occurred. Please try again or contact support.');
});

export default bot;
