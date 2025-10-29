/**
 * Reset Local Environment
 * 
 * This script wipes the Firebase emulator data and reseeds the database.
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { seedAll } from './seedAll';
import { seedAuth } from './seedAuth';

async function resetLocalEnv(): Promise<void> {
  console.log('🔄 Starting local environment reset...\n');
  
  try {
    // Check if .firebase-data directory exists
    const firebaseDataPath = '.firebase-data';
    
    if (existsSync(firebaseDataPath)) {
      console.log('🗑️  Removing existing emulator data...');
      rmSync(firebaseDataPath, { recursive: true, force: true });
      console.log('✅ Emulator data cleared');
    } else {
      console.log('ℹ️  No existing emulator data found');
    }
    
    // Clear other temporary files
    const tempFiles = [
      'firestore-debug.log',
      'ui-debug.log',
      'database-debug.log',
      'firebase-debug.log',
      'pubsub-debug.log'
    ];
    
    tempFiles.forEach(file => {
      if (existsSync(file)) {
        rmSync(file, { force: true });
        console.log(`🗑️  Removed ${file}`);
      }
    });
    
    console.log('\n🌱 Reseeding database...');
    
    // Seed Firestore data
    console.log('📄 Seeding Firestore collections...');
    await seedAll({ clear: true, count: 10 });
    
    // Seed Auth users
    console.log('\n👥 Seeding Auth users...');
    await seedAuth();
    
    console.log('\n🎉 Local environment reset completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start emulators: npm run sandbox:start');
    console.log('   2. Verify data: npm run sandbox:health');
    console.log('   3. View in Emulator UI: http://localhost:4000');
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Error during reset:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  resetLocalEnv().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { resetLocalEnv };

