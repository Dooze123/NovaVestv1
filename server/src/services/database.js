import { query } from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Initialize database and create all tables
 */
export const initializeDatabase = async () => {
  try {
    logger.info('🔧 Initializing database...');

    // Read and execute init.sql
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const initSqlPath = path.join(__dirname, '../../database/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    // Split by ; and execute each statement
    const statements = initSql.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      await query(statement);
    }

    logger.info('✅ Database initialized successfully');
    return true;
  } catch (error) {
    logger.error({ message: 'Database initialization error', error: error.message });
    throw error;
  }
};

/**
 * Seed sample data for development
 */
export const seedDatabase = async () => {
  try {
    logger.info('🌱 Seeding database with sample data...');

    // Create sample investment plans
    const plans = [
      {
        plan_name: 'Starter Plan',
        minimum_amount: 5000,
        maximum_amount: 50000,
        daily_profit_percentage: 1,
        duration_days: 30,
        roi_percentage: 30,
        risk_level: 'low'
      },
      {
        plan_name: 'Silver Plan',
        minimum_amount: 50000,
        maximum_amount: 200000,
        daily_profit_percentage: 2,
        duration_days: 30,
        roi_percentage: 60,
        risk_level: 'medium'
      },
      {
        plan_name: 'Gold Plan',
        minimum_amount: 200000,
        maximum_amount: 500000,
        daily_profit_percentage: 3,
        duration_days: 30,
        roi_percentage: 90,
        risk_level: 'medium'
      },
      {
        plan_name: 'Platinum Plan',
        minimum_amount: 500000,
        daily_profit_percentage: 4,
        duration_days: 30,
        roi_percentage: 120,
        risk_level: 'high'
      }
    ];

    for (const plan of plans) {
      await query(
        `INSERT INTO investment_plans (
          id, plan_name, minimum_amount, maximum_amount, daily_profit_percentage,
          duration_days, roi_percentage, risk_level, status
        ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'active')
        ON CONFLICT DO NOTHING`,
        [
          plan.plan_name,
          plan.minimum_amount,
          plan.maximum_amount,
          plan.daily_profit_percentage,
          plan.duration_days,
          plan.roi_percentage,
          plan.risk_level
        ]
      );
    }

    logger.info('✅ Sample data seeded successfully');
    return true;
  } catch (error) {
    logger.error({ message: 'Database seeding error', error: error.message });
    throw error;
  }
};

/**
 * Migrate database to latest version
 */
export const migrateDatabase = async () => {
  try {
    logger.info('📋 Running database migrations...');
    // Add migration logic here as needed
    logger.info('✅ Migrations completed successfully');
    return true;
  } catch (error) {
    logger.error({ message: 'Migration error', error: error.message });
    throw error;
  }
};
