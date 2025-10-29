# Seeding & Scenarios

This guide covers the modular seeding system and automation scenarios for testing your Firebase application.

## Seeding System Overview

The seeding system uses a hybrid approach combining:

- **Faker.js** - For realistic dynamic data (names, emails, dates)
- **JSON Templates** - For project-specific structure and business logic

## Creating Seed Modules

### Module Structure

Each seed module follows this pattern:

```typescript
// sandbox/modules/example.seed.ts
import { faker } from '@faker-js/faker';
import { SeedOptions, SeedResult } from './types';

export async function seedExample(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const { clear = false, count = 10 } = options;
  
  try {
    // Implementation here
    return {
      module: 'example',
      created: count,
      duration: Date.now() - startTime,
      success: true
    };
  } catch (error) {
    return {
      module: 'example',
      created: 0,
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    };
  }
}
```

### Example: Users Module

```typescript
// sandbox/modules/users.seed.ts.example
import { faker } from '@faker-js/faker';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { SeedOptions, SeedResult } from './types';

// Load template data
const templateData = require('../seed-data/users.example.json');

export async function seedUsers(options: SeedOptions = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const { clear = false, count = 10 } = options;
  
  try {
    // Initialize Firebase (emulator mode)
    if (!getApps().length) {
      const app = initializeApp({
        projectId: 'demo-project',
        apiKey: 'fake-api-key'
      });
      
      const db = getFirestore(app);
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    
    // Clear existing data if requested
    if (clear) {
      const snapshot = await getDocs(usersRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }
    
    // Generate users
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = {
        // Faker.js for dynamic data
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        createdAt: new Date(),
        
        // Template data for business logic
        role: faker.helpers.arrayElement(templateData.roles),
        preferences: templateData.defaultPreferences,
        settings: templateData.defaultSettings
      };
      
      users.push(user);
    }
    
    // Add to Firestore
    const addPromises = users.map(user => addDoc(usersRef, user));
    await Promise.all(addPromises);
    
    return {
      module: 'users',
      created: count,
      duration: Date.now() - startTime,
      success: true
    };
  } catch (error) {
    return {
      module: 'users',
      created: 0,
      duration: Date.now() - startTime,
      success: false,
      error: error.message
    };
  }
}
```

### JSON Templates

Templates provide structure and business logic:

```json
// sandbox/seed-data/users.example.json
{
  "roles": ["admin", "user", "guest"],
  "defaultPreferences": {
    "theme": "light",
    "notifications": true,
    "language": "en"
  },
  "defaultSettings": {
    "emailVerified": false,
    "profileComplete": false,
    "lastLogin": null
  }
}
```

## Available Seed Modules

### Users Module
- **Faker Data**: Names, emails, phone numbers, creation dates
- **Template Data**: Roles, preferences, settings
- **Collection**: `users`

### Products Module
- **Faker Data**: Product names, descriptions, prices, SKUs
- **Template Data**: Categories, specifications, inventory rules
- **Collection**: `products`

### Orders Module
- **Faker Data**: Order IDs, dates, amounts, quantities
- **Template Data**: Status workflow, payment methods, shipping
- **Collection**: `orders`

### Config Module
- **Faker Data**: Minimal (mostly static)
- **Template Data**: Feature flags, system settings, API configs
- **Collection**: `config`

## Running Seed Operations

### Command Line

```bash
# Seed all modules
npm run seed:all

# Seed specific module
npm run seed:module -- users --count=50 --clear

# Seed with options
npm run seed:all -- --clear --skip-config
```

### Programmatic

```typescript
import { seedUsers } from './sandbox/modules/users.seed';

const result = await seedUsers({ clear: true, count: 25 });
console.log(`Created ${result.created} users in ${result.duration}ms`);
```

## Writing Scenarios

Scenarios simulate real-world workflows and test your application's behavior.

### Scenario Structure

```typescript
// scripts/scenarios/exampleScenario.ts.example
import { functionRunner } from '../utils/functionRunner';
import { ScenarioResult } from './types';

export async function runExampleScenario(options: ScenarioOptions = {}): Promise<ScenarioResult> {
  const startTime = Date.now();
  
  try {
    // Scenario implementation
    const results = [];
    
    // Step 1: Create user
    const userResult = await createUser();
    results.push(userResult);
    
    // Step 2: Create order
    const orderResult = await createOrder(userResult.userId);
    results.push(orderResult);
    
    // Step 3: Trigger function
    const functionResult = await functionRunner('onOrderCreated', {
      orderId: orderResult.orderId,
      userId: userResult.userId
    });
    results.push(functionResult);
    
    return {
      scenario: 'exampleScenario',
      duration: Date.now() - startTime,
      success: true,
      steps: results,
      metrics: {
        usersCreated: 1,
        ordersCreated: 1,
        functionsTriggered: 1
      }
    };
  } catch (error) {
    return {
      scenario: 'exampleScenario',
      duration: Date.now() - startTime,
      success: false,
      error: error.message,
      steps: []
    };
  }
}
```

### Available Scenarios

#### User Signup Scenario
- Creates user in Auth emulator
- Creates user document in Firestore
- Triggers welcome function
- Reports metrics

#### Order Flow Scenario
- Creates order document
- Updates inventory
- Triggers notification function
- Simulates payment processing

#### Stress Test Scenario
- Configurable operation count
- Read/write/mixed modes
- Performance metrics
- JSON report generation

## Function Runner Utility

The function runner provides a simple way to trigger Cloud Functions:

```typescript
// scripts/utils/functionRunner.ts
export async function functionRunner(functionName: string, payload: any = {}) {
  const url = `http://localhost:5001/demo-project/us-central1/${functionName}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  return {
    status: response.status,
    data: await response.json(),
    duration: Date.now() - startTime
  };
}
```

## Payload Templates

Create reusable payload templates for function calls:

```json
// scripts/payloads/user.json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

## CLI Tools

### Trigger Function

```bash
# Trigger with payload file
npm run sandbox:trigger exampleHttpFunction payloads/user.json

# Trigger with inline JSON
npm run sandbox:trigger exampleHttpFunction '{"name":"Jane","email":"jane@example.com"}'

# Trigger without payload
npm run sandbox:trigger dailyCleanup
```

### Run Scenario

```bash
# Run specific scenario
npm run sandbox:scenario userSignup

# Run with options
npm run sandbox:scenario orderFlow -- --count=10 --interval=2s

# Run stress test
npm run sandbox:stress -- --operations=1000 --type=mixed --report
```

## Best Practices

### Seed Modules

1. **Use Faker for dynamic data** - Names, emails, dates, IDs
2. **Use templates for business logic** - Roles, categories, workflows
3. **Handle errors gracefully** - Return detailed error information
4. **Support clear option** - Allow wiping existing data
5. **Make count configurable** - Support different data volumes

### Scenarios

1. **Test realistic workflows** - Simulate actual user behavior
2. **Include error handling** - Test failure scenarios
3. **Generate metrics** - Track performance and success rates
4. **Support configuration** - Make scenarios flexible
5. **Document assumptions** - Explain what each scenario tests

### Function Testing

1. **Use realistic payloads** - Test with actual data structures
2. **Test error cases** - Invalid inputs, missing fields
3. **Measure performance** - Track response times
4. **Verify side effects** - Check Firestore changes, notifications
5. **Clean up after tests** - Remove test data when done

## Troubleshooting

### Seeding Issues

**Error:** "Permission denied"
- Ensure emulators are running
- Check Firestore rules allow writes
- Verify you're connected to emulators, not production

**Error:** "Module not found"
- Check module file exists in `sandbox/modules/`
- Verify export name matches filename
- Ensure TypeScript compilation succeeds

### Scenario Issues

**Error:** "Function not found"
- Check function name matches exactly
- Verify Functions emulator is running
- Check function is deployed to emulator

**Error:** "Network request failed"
- Ensure Functions emulator is on port 5001
- Check function URL is correct
- Verify payload JSON is valid

### Performance Issues

**Slow seeding:**
- Reduce batch sizes
- Use parallel operations where possible
- Check emulator performance

**Slow scenarios:**
- Add delays between operations
- Monitor emulator resource usage
- Consider running fewer concurrent operations

For more information, see the [Getting Started Guide](GETTING_STARTED.md) and [Troubleshooting](TROUBLESHOOTING.md).

