#!/usr/bin/env node

import { initializeDatabase, seedDatabase } from '../services/database.js';
import logger from '../utils/logger.js';

async function main() {
  try {
    logger.info('🚀 Starting database initialization...');
    await initializeDatabase();
    await seedDatabase();
    logger.info('✅ Database setup completed!');
    process.exit(0);
  } catch (error) {
    logger.error({ message: 'Setup failed', error: error.message });
    process.exit(1);
  }
}

main();
