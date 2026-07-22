#!/usr/bin/env node

import { migrateDatabase } from '../services/database.js';
import logger from '../utils/logger.js';

async function main() {
  try {
    logger.info('🚀 Starting database migrations...');
    await migrateDatabase();
    logger.info('✅ Migrations completed!');
    process.exit(0);
  } catch (error) {
    logger.error({ message: 'Migration failed', error: error.message });
    process.exit(1);
  }
}

main();
