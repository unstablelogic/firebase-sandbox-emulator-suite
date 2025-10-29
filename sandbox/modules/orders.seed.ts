/**
 * Orders Seed Module Example
 * 
 * This module demonstrates seeding order data using Faker.js
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
  deleteDoc,
  query,
  limit,
  getDocs as getFirestoreDocs
} from 'firebase/firestore';
import { SeedOptions, SeedResult } from './types';

// Load template data
const templateData = require('../seed-data/orders.example.json');

export async function seedOrders(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const { clear = false, count = 10 } = options;
  
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
      
      const db = getFirestore(app);
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    const db = getFirestore();
    const ordersRef = collection(db, 'orders');
    
    // Clear existing data if requested
    if (clear) {
      const snapshot = await getDocs(ordersRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`Cleared ${snapshot.size} existing orders`);
    }
    
    // Get existing users and products for realistic relationships
    const usersSnapshot = await getFirestoreDocs(query(collection(db, 'users'), limit(50)));
    const productsSnapshot = await getFirestoreDocs(query(collection(db, 'products'), limit(100)));
    
    const userIds = usersSnapshot.docs.map(doc => doc.id);
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Generate orders
    const orders = [];
    for (let i = 0; i < count; i++) {
      const orderDate = faker.date.recent(30);
      const status = faker.helpers.arrayElement(templateData.statusWorkflow) as any;
      const paymentMethod = faker.helpers.arrayElement(templateData.paymentMethods) as any;
      const shippingOption = faker.helpers.arrayElement(templateData.shippingOptions) as any;
      
      // Generate line items
      const lineItemCount = faker.number.int({ min: 1, max: 5 });
      const lineItems = [];
      let subtotal = 0;
      
      for (let j = 0; j < lineItemCount; j++) {
        const product = faker.helpers.arrayElement(products) as any;
        const quantity = faker.number.int({ min: 1, max: 5 });
        const price = product.price || faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
        const lineTotal = price * quantity;
        
        lineItems.push({
          productId: product.id,
          productName: product.name || faker.commerce.productName(),
          quantity,
          price,
          lineTotal
        });
        
        subtotal += lineTotal;
      }
      
      const taxRate = templateData.taxRates.default;
      const taxAmount = subtotal * taxRate;
      const shippingCost = shippingOption.cost;
      const total = subtotal + taxAmount + shippingCost;
      
      const order = {
        // Faker.js for dynamic data
        orderNumber: faker.string.alphanumeric(8).toUpperCase(),
        createdAt: orderDate,
        updatedAt: new Date(),
        
        // Template data for business logic
        status: status.status,
        statusDescription: status.description,
        paymentMethod: paymentMethod.id,
        paymentMethodName: paymentMethod.name,
        shippingOption: shippingOption.id,
        shippingOptionName: shippingOption.name,
        
        // Order details
        userId: userIds.length > 0 ? faker.helpers.arrayElement(userIds) : null,
        lineItems,
        
        // Pricing breakdown
        pricing: {
          subtotal,
          taxRate,
          taxAmount,
          shippingCost,
          total
        },
        
        // Shipping information
        shipping: {
          address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country()
          },
          trackingNumber: faker.string.alphanumeric(12).toUpperCase(),
          estimatedDelivery: faker.date.future({ days: 7 })
        },
        
        // Additional realistic data
        notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        discountCode: faker.datatype.boolean() ? faker.string.alphanumeric(6).toUpperCase() : null,
        discountAmount: faker.number.float({ min: 0, max: 50, fractionDigits: 2 }),
        
        // Status history
        statusHistory: [
          {
            status: 'pending',
            timestamp: orderDate,
            note: 'Order placed'
          }
        ]
      };
      
      // Add status updates based on current status
      if (status.status !== 'pending') {
        order.statusHistory.push({
          status: 'confirmed',
          timestamp: new Date(orderDate.getTime() + faker.number.int({ min: 1, max: 24 }) * 60 * 60 * 1000),
          note: 'Order confirmed'
        });
      }
      
      if (['shipped', 'delivered', 'completed'].includes(status.status)) {
        order.statusHistory.push({
          status: 'processing',
          timestamp: new Date(orderDate.getTime() + faker.number.int({ min: 1, max: 48 }) * 60 * 60 * 1000),
          note: 'Order processing'
        });
        
        order.statusHistory.push({
          status: 'shipped',
          timestamp: new Date(orderDate.getTime() + faker.number.int({ min: 2, max: 72 }) * 60 * 60 * 1000),
          note: 'Order shipped'
        });
      }
      
      if (['delivered', 'completed'].includes(status.status)) {
        order.statusHistory.push({
          status: 'delivered',
          timestamp: new Date(orderDate.getTime() + faker.number.int({ min: 3, max: 120 }) * 60 * 60 * 1000),
          note: 'Order delivered'
        });
      }
      
      orders.push(order);
    }
    
    // Add to Firestore
    const addPromises = orders.map(order => addDoc(ordersRef, order));
    await Promise.all(addPromises);
    
    console.log(`✅ Created ${count} orders`);
    
    return {
      module: 'orders',
      created: count,
      duration: Date.now() - startTime,
      success: true
    };
  } catch (error) {
    console.error(`❌ Failed to seed orders:`, error);
    return {
      module: 'orders',
      created: 0,
      duration: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

