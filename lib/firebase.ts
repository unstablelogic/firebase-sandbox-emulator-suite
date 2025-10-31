/**
 * Firebase Client Initialization
 * 
 * This file initializes Firebase client SDK and connects to emulators
 * when running in development mode.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'fake-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'true') {
  // Only connect if not already connected (check if running in browser/client-side)
  if (typeof window !== 'undefined') {
    try {
      // Connect to Firestore emulator
      connectFirestoreEmulator(db, 'localhost', 8080);
      
      // Connect to Auth emulator
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      
      // Connect to Functions emulator
      connectFunctionsEmulator(functions, 'localhost', 5001);
      
      console.log('🔥 Connected to Firebase Emulator Suite');
      console.log('   • Firestore: localhost:8080');
      console.log('   • Auth: localhost:9099');
      console.log('   • Functions: localhost:5001');
      console.log('   • UI: http://localhost:4000');
    } catch (error: any) {
      // Check if error is due to emulator already being connected
      if (error?.code === 'failed-precondition' || error?.message?.includes('already been called')) {
        // Emulator already connected, which is fine
        console.log('🔥 Firebase Emulator Suite already connected');
      } else {
        console.error('Firebase emulator connection failed:', error);
      }
    }
  }
} else {
  console.log('🔥 Connected to Firebase Production');
}

export default app;

