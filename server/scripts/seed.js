#!/usr/bin/env node

import { seedDatabase } from '../services/database.js';
import logger from '../utils/logger.js';

async function main() {
  try {
    logger.info('🚀 Starting database seeding...');
    await seedDatabase();
    logger.info('✅ Database seeded!');
    process.exit(0);
  } catch (error) {
    logger.error({ message: 'Seeding failed', error: error.message });
    process.exit(1);
  }
}

main();
