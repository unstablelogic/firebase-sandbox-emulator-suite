/**
 * Health Check Script
 * 
 * Checks if all Firebase emulator ports are active and accessible.
 */

import { sandboxConfig } from '../sandbox/sandbox.config';

interface PortStatus {
  port: number;
  service: string;
  status: 'listening' | 'not_listening' | 'error';
  url?: string;
}

async function checkPort(port: number, service: string): Promise<PortStatus> {
  try {
    const response = await fetch(`http://localhost:${port}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    
    return {
      port,
      service,
      status: 'listening',
      url: `http://localhost:${port}`
    };
  } catch (error) {
    return {
      port,
      service,
      status: 'not_listening'
    };
  }
}

async function healthCheck(): Promise<void> {
  console.log('🏥 Firebase Emulator Health Check\n');
  
  const ports = [
    { port: sandboxConfig.ports.firestore, service: 'Firestore Emulator' },
    { port: sandboxConfig.ports.auth, service: 'Auth Emulator' },
    { port: sandboxConfig.ports.functions, service: 'Functions Emulator' },
    { port: sandboxConfig.ports.ui, service: 'Emulator UI' }
  ];
  
  const results: PortStatus[] = [];
  
  // Check each port
  for (const { port, service } of ports) {
    console.log(`🔍 Checking ${service} on port ${port}...`);
    const result = await checkPort(port, service);
    results.push(result);
    
    if (result.status === 'listening') {
      console.log(`✅ Port ${port} is listening (${service})`);
    } else {
      console.log(`❌ Port ${port} is not listening (${service})`);
    }
  }
  
  console.log('\n============================================================');
  
  const healthy = results.filter(r => r.status === 'listening');
  const unhealthy = results.filter(r => r.status !== 'listening');
  
  if (unhealthy.length === 0) {
    console.log('✅ All emulators are healthy and running!');
    console.log('\n📋 Access URLs:');
    results.forEach(result => {
      if (result.url) {
        console.log(`   • ${result.service}: ${result.url}`);
      }
    });
    process.exit(0);
  } else {
    console.log('❌ Some emulators are not running!');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Start emulators: npm run sandbox:start');
    console.log('   2. Check for port conflicts');
    console.log('   3. Verify Firebase CLI is installed');
    console.log('   4. Check emulator logs for errors');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  healthCheck().catch(error => {
    console.error('💥 Health check failed:', error);
    process.exit(1);
  });
}

export { healthCheck };

