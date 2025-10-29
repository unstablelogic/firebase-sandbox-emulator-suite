/**
 * Seed All Modules Orchestrator
 * 
 * This script automatically discovers and runs all available seed modules.
 */

import { listModules, seedModule } from '../sandbox/sandbox.config';
import { SeedOptions, SeedResult } from '../sandbox/modules/types';

// Parse command line arguments
function parseArgs(): SeedOptions & { skipModules?: string[] } {
  const args = process.argv.slice(2);
  const options: SeedOptions & { skipModules?: string[] } = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--clear') {
      options.clear = true;
    } else if (arg === '--count' && args[i + 1]) {
      options.count = parseInt(args[i + 1]);
      i++; // Skip next argument
    } else if (arg.startsWith('--skip-')) {
      const module = arg.replace('--skip-', '');
      if (!options.skipModules) options.skipModules = [];
      options.skipModules.push(module);
    }
  }
  
  return options;
}

async function seedAll(): Promise<void> {
  console.log('🌱 Starting comprehensive database seeding...\n');
  
  const options = parseArgs();
  const modules = listModules();
  
  console.log(`📋 Found ${modules.length} seed modules:`, modules.join(', '));
  console.log(`⚙️  Options:`, {
    clear: options.clear || false,
    count: options.count || 10,
    skipModules: options.skipModules || []
  });
  console.log('');
  
  const results: SeedResult[] = [];
  const startTime = Date.now();
  
  // Seed each module
  for (const module of modules) {
    if (options.skipModules?.includes(module)) {
      console.log(`⏭️  Skipping ${module} module`);
      continue;
    }
    
    console.log(`🔄 Seeding ${module}...`);
    
    try {
      const result = await seedModule(module, options);
      results.push(result);
      
      if (result.success) {
        console.log(`✅ ${module}: ${result.created} documents created in ${result.duration}ms`);
      } else {
        console.log(`❌ ${module}: Failed - ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${module}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      results.push({
        module,
        created: 0,
        duration: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    console.log('');
  }
  
  // Summary
  const totalTime = Date.now() - startTime;
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalCreated = successful.reduce((sum, r) => sum + r.created, 0);
  
  console.log('📊 Seeding Summary');
  console.log('==================');
  console.log(`✅ Successful modules: ${successful.length}`);
  console.log(`❌ Failed modules: ${failed.length}`);
  console.log(`📄 Total documents created: ${totalCreated}`);
  console.log(`⏱️  Total time: ${totalTime}ms`);
  
  if (successful.length > 0) {
    console.log('\n✅ Successful Results:');
    console.table(successful.map(r => ({
      Module: r.module,
      Created: r.created,
      Duration: `${r.duration}ms`,
      Success: r.success ? '✅' : '❌'
    })));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Results:');
    console.table(failed.map(r => ({
      Module: r.module,
      Error: r.error,
      Success: '❌'
    })));
  }
  
  // Exit with error code if any modules failed
  if (failed.length > 0) {
    console.log('\n💥 Some modules failed. Check the errors above.');
    process.exit(1);
  }
  
  console.log('\n🎉 All modules seeded successfully!');
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  seedAll().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { seedAll };

