/**
 * Auth Emulator Seeder
 * 
 * This script creates test users in the Firebase Auth emulator.
 */

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  connectAuthEmulator, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

interface AuthUser {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

const testUsers: AuthUser[] = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    displayName: 'Admin User',
    role: 'admin'
  },
  {
    email: 'user@demo.com',
    password: 'user123',
    displayName: 'Regular User',
    role: 'user'
  },
  {
    email: 'guest@demo.com',
    password: 'guest123',
    displayName: 'Guest User',
    role: 'guest'
  },
  {
    email: 'test@demo.com',
    password: 'test123',
    displayName: 'Test User',
    role: 'user'
  }
];

async function seedAuth(): Promise<void> {
  console.log('🔐 Starting Auth emulator seeding...\n');
  
  try {
    // Initialize Firebase (emulator mode)
    if (!getApps().length) {
      const app = initializeApp({
        projectId: 'demo-project',
        apiKey: 'fake-api-key',
        authDomain: 'demo-project.firebaseapp.com',
        storageBucket: 'demo-project.appspot.com',
        messagingSenderId: '123456789',
        appId: '1:123456789:web:abcdef123456'
      });
      
      const auth = getAuth(app);
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    }
    
    const auth = getAuth();
    const results = [];
    
    console.log('👥 Creating test users...\n');
    
    for (const userData of testUsers) {
      try {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        );
        
        // Update profile
        await updateProfile(userCredential.user, {
          displayName: userData.displayName
        });
        
        results.push({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          role: userData.role,
          uid: userCredential.user.uid,
          status: '✅ Created'
        });
        
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          results.push({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName,
            role: userData.role,
            uid: 'existing',
            status: '⚠️  Already exists'
          });
          console.log(`⚠️  User already exists: ${userData.email}`);
        } else {
          console.error(`❌ Failed to create user ${userData.email}:`, error.message);
          results.push({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName,
            role: userData.role,
            uid: 'error',
            status: `❌ Error: ${error.message}`
          });
        }
      }
    }
    
    console.log('\n📊 Auth Seeding Summary');
    console.log('========================');
    console.table(results.map(r => ({
      Email: r.email,
      Password: r.password,
      Role: r.role,
      Status: r.status
    })));
    
    console.log('\n🔗 Access URLs:');
    console.log('   • Auth Emulator UI: http://localhost:4000/auth');
    console.log('   • Direct Auth API: http://localhost:9099');
    
    console.log('\n🎉 Auth seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error in Auth seeding:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedAuth().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { seedAuth };

