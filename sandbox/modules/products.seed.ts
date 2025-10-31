/**
 * Products Seed Module Example
 * 
 * This module demonstrates seeding product data using Faker.js
 * for dynamic data and JSON templates for business logic.
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
const templateData = require('../seed-data/products.example.json');

export async function seedProducts(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const { clear = false, count = 10 } = options;
  
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
    const productsRef = collection(db, 'products');
    
    // Clear existing data if requested
    if (clear) {
      const snapshot = await getDocs(productsRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`Cleared ${snapshot.size} existing products`);
    }
    
    // Generate products
    const products = [];
    for (let i = 0; i < count; i++) {
      const category = faker.helpers.arrayElement(templateData.categories) as any;
      const pricingTier = faker.helpers.arrayElement(Object.keys(templateData.pricingTiers));
      const tierRange = templateData.pricingTiers[pricingTier];
      
      const product = {
        // Faker.js for dynamic data
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: faker.number.float({ min: tierRange.min, max: tierRange.max, fractionDigits: 2 }),
        imageUrl: faker.image.url(),
        createdAt: new Date(),
        updatedAt: new Date(),
        
        // Template data for business logic
        category: category.id,
        categoryName: category.name,
        status: faker.helpers.arrayElement(templateData.statusOptions),
        pricingTier,
        
        // Inventory management
        inventory: {
          quantity: faker.number.int({ min: 0, max: 1000 }),
          lowStockThreshold: templateData.inventorySettings.lowStockThreshold,
          outOfStockThreshold: templateData.inventorySettings.outOfStockThreshold,
          autoReorder: templateData.inventorySettings.autoReorder
        },
        
        // Specifications based on category
        specifications: generateSpecifications(category.id, templateData.specifications),
        
        // Additional realistic data
        brand: faker.company.name(),
        weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
        dimensions: {
          length: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
          width: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
          height: faker.number.float({ min: 1, max: 100, fractionDigits: 1 })
        },
        tags: faker.helpers.arrayElements([
          'featured', 'sale', 'new', 'popular', 'limited', 'eco-friendly', 'premium'
        ], { min: 1, max: 3 }),
        rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
        reviewCount: faker.number.int({ min: 0, max: 500 })
      };
      
      products.push(product);
    }
    
    // Add to Firestore
    const addPromises = products.map(product => addDoc(productsRef, product));
    await Promise.all(addPromises);
    
    console.log(`✅ Created ${count} products`);
    
    return {
      module: 'products',
      created: count,
      duration: Date.now() - startTime,
      success: true
    };
  } catch (error) {
    console.error(`❌ Failed to seed products:`, error);
    return {
      module: 'products',
      created: 0,
      duration: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateSpecifications(categoryId: string, specTemplates: any): any {
  const specs: any = {};
  const categorySpecs = specTemplates[categoryId] || [];
  
  categorySpecs.forEach((spec: string) => {
    switch (spec) {
      case 'brand':
        specs.brand = faker.company.name();
        break;
      case 'model':
        specs.model = faker.string.alphanumeric(6).toUpperCase();
        break;
      case 'warranty':
        specs.warranty = faker.helpers.arrayElement(['1 year', '2 years', '3 years', '5 years']);
        break;
      case 'power_consumption':
        specs.powerConsumption = faker.number.int({ min: 10, max: 500 }) + 'W';
        break;
      case 'author':
        specs.author = faker.person.fullName();
        break;
      case 'publisher':
        specs.publisher = faker.company.name();
        break;
      case 'isbn':
        specs.isbn = faker.string.numeric(13);
        break;
      case 'pages':
        specs.pages = faker.number.int({ min: 50, max: 1000 });
        break;
      case 'language':
        specs.language = faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German']);
        break;
      case 'size':
        specs.size = faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
        break;
      case 'color':
        specs.color = faker.color.human();
        break;
      case 'material':
        specs.material = faker.helpers.arrayElement(['Cotton', 'Polyester', 'Wool', 'Leather', 'Metal', 'Plastic']);
        break;
      case 'care_instructions':
        specs.careInstructions = faker.helpers.arrayElement(['Machine wash', 'Hand wash', 'Dry clean only', 'Air dry']);
        break;
      case 'dimensions':
        specs.dimensions = `${faker.number.int({ min: 1, max: 100 })}" x ${faker.number.int({ min: 1, max: 100 })}"`;
        break;
      case 'assembly_required':
        specs.assemblyRequired = faker.datatype.boolean();
        break;
      default:
        specs[spec] = faker.lorem.word();
    }
  });
  
  return specs;
}

