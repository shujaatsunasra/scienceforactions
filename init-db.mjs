#!/usr/bin/env node

// Simple database initialization script
import { databaseInitializer } from './src/services/databaseInitializer.js';

async function runInitialization() {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Generate a small test dataset
    await databaseInitializer.generateTestData();
    
    // Show stats
    const stats = await databaseInitializer.getStats();
    console.log('📊 Database Statistics:', stats);
    
    console.log('✅ Initialization complete!');
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

if (process.argv.includes('--run')) {
  runInitialization();
}
