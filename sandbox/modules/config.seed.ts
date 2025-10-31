/**
 * Config Seed Module Example
 * 
 * This module demonstrates seeding application configuration data
 * using minimal randomization and JSON templates for structure.
 */

import { faker } from '@faker-js/faker';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc 
} from 'firebase/firestore';
import { SeedOptions, SeedResult } from './types';

// Load template data
const templateData = require('../seed-data/config.example.json');

export async function seedConfig(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const { clear = false, count = 1 } = options; // Config is typically single document
  
  try {
    // Initialize Firebase (emulator mode)
    let app;
    if (!getApps().length) {
      app = initializeApp({
        projectId: 'demo-project',
        apiKey: 'fake-api-key',
        authDomain: 'demo-project.firebaseapp.com',
        storageBucket: 'demo-project.appspot.com',
        messagingSenderId: '123456789',
        appId: '1:123456789:web:abcdef123456'
      });
    } else {
      app = getApps()[0];
    }
    
    const db = getFirestore(app);
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      // Emulator already connected, ignore
    }
    const configRef = collection(db, 'config');
    
    // Clear existing data if requested
    if (clear) {
      const snapshot = await getDocs(configRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`Cleared ${snapshot.size} existing config documents`);
    }
    
    // Generate config documents
    const configs = [];
    for (let i = 0; i < count; i++) {
      const config = {
        // Template data for business logic (minimal randomization)
        featureFlags: {
          ...templateData.featureFlags,
          // Slight randomization for demo purposes
          enableAnalytics: faker.datatype.boolean(),
          enableBetaFeatures: faker.datatype.boolean()
        },
        
        systemSettings: {
          ...templateData.systemSettings,
          // Randomize some settings
          defaultLanguage: faker.helpers.arrayElement(templateData.systemSettings.supportedLanguages),
          timezone: faker.helpers.arrayElement(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']),
          currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'JPY'])
        },
        
        apiSettings: {
          ...templateData.apiSettings,
          // Randomize rate limits slightly
          rateLimit: {
            requestsPerMinute: faker.number.int({ min: 80, max: 120 }),
            burstLimit: faker.number.int({ min: 150, max: 250 })
          }
        },
        
        emailSettings: {
          ...templateData.emailSettings,
          // Randomize SMTP settings
          smtpPort: faker.helpers.arrayElement([587, 465, 25]),
          smtpSecure: faker.datatype.boolean()
        },
        
        securitySettings: {
          ...templateData.securitySettings,
          // Randomize security settings
          passwordMinLength: faker.number.int({ min: 6, max: 12 }),
          sessionTimeout: faker.number.int({ min: 1800, max: 7200 }),
          maxLoginAttempts: faker.number.int({ min: 3, max: 10 })
        },
        
        maintenanceMode: {
          ...templateData.maintenanceMode,
          // Randomize maintenance mode
          enabled: faker.datatype.boolean({ probability: 0.1 }) // 10% chance of being enabled
        },
        
        // Additional realistic data
        version: faker.system.semver(),
        environment: faker.helpers.arrayElement(['development', 'staging', 'production']),
        lastUpdated: new Date(),
        updatedBy: faker.person.fullName(),
        
        // Analytics and monitoring
        analytics: {
          enabled: faker.datatype.boolean(),
          trackingId: faker.string.alphanumeric(10),
          events: [
            'page_view',
            'user_signup',
            'order_placed',
            'product_view',
            'search'
          ]
        },
        
        // Performance settings
        performance: {
          cacheTimeout: faker.number.int({ min: 300, max: 3600 }),
          maxConcurrentRequests: faker.number.int({ min: 50, max: 200 }),
          enableCompression: faker.datatype.boolean(),
          enableCaching: faker.datatype.boolean()
        },
        
        // Integration settings
        integrations: {
          paymentProvider: faker.helpers.arrayElement(['stripe', 'paypal', 'square']),
          emailProvider: faker.helpers.arrayElement(['sendgrid', 'mailgun', 'ses']),
          analyticsProvider: faker.helpers.arrayElement(['google', 'mixpanel', 'amplitude']),
          cdnProvider: faker.helpers.arrayElement(['cloudflare', 'aws', 'cloudinary'])
        }
      };
      
      configs.push(config);
    }
    
    // Add to Firestore
    const addPromises = configs.map(config => addDoc(configRef, config));
    await Promise.all(addPromises);
    
    console.log(`✅ Created ${count} config document(s)`);
    
    return {
      module: 'config',
      created: count,
      duration: Date.now() - startTime,
      success: true
    };
  } catch (error) {
    console.error(`❌ Failed to seed config:`, error);
    return {
      module: 'config',
      created: 0,
      duration: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

