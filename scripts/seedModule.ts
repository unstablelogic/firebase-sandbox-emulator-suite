/**
 * Individual Module Seeder
 * 
 * This script allows seeding individual modules with custom options.
 */

import { seedModule } from '../sandbox/sandbox.config';
import { SeedOptions } from '../sandbox/modules/types';

// Parse command line arguments
function parseArgs(): { module: string; options: SeedOptions } {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run seed:module -- <module-name> [options]');
    console.log('');
    console.log('Available modules: users, products, orders, config');
    console.log('');
    console.log('Options:');
    console.log('  --clear     Clear existing data before seeding');
    console.log('  --count=N   Number of documents to create (default: 10)');
    console.log('');
    console.log('Examples:');
    console.log('  npm run seed:module -- users --count=50 --clear');
    console.log('  npm run seed:module -- products --count=25');
    process.exit(1);
  }
  
  const module = args[0];
  const options: SeedOptions = {};
  
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--clear') {
      options.clear = true;
    } else if (arg === '--count' && args[i + 1]) {
      options.count = parseInt(args[i + 1]);
      i++; // Skip next argument
    }
  }
  
  return { module, options };
}

async function seedIndividualModule(): Promise<void> {
  console.log('🌱 Starting individual module seeding...\n');
  
  const { module, options } = parseArgs();
  
  console.log(`📋 Module: ${module}`);
  console.log(`⚙️  Options:`, {
    clear: options.clear || false,
    count: options.count || 10
  });
  console.log('');
  
  try {
    console.log(`🔄 Seeding ${module}...`);
    const result = await seedModule(module, options);
    
    if (result.success) {
      console.log(`✅ ${module}: ${result.created} documents created in ${result.duration}ms`);
      console.log('\n🎉 Module seeded successfully!');
      process.exit(0);
    } else {
      console.log(`❌ ${module}: Failed - ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`💥 Error seeding ${module}:`, error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedIndividualModule().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { seedIndividualModule };

