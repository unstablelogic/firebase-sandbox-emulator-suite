# Basic Setup Example

This example demonstrates how to set up the Firebase Sandbox Emulator Suite for a new project.

## Prerequisites

- Node.js 20+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git installed

## Step-by-Step Setup

### 1. Clone the Template

```bash
# Clone the template repository
git clone https://github.com/unstablelogic/firebase-sandbox-emulator-suite.git my-project
cd my-project

# Remove the template's git history
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Copy the sandbox environment template
cp .env.sandbox.example .env.local

# Edit .env.local with your project details
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
# etc.
```

### 4. Start the Sandbox

```bash
# Start Firebase emulators
npm run sandbox:start

# In another terminal, start the Next.js app
npm run dev
```

### 5. Verify Setup

1. **Emulator UI**: http://localhost:4000
2. **Next.js App**: http://localhost:3000
3. **Sandbox Panel**: http://localhost:3000/sandbox

### 6. Seed Test Data

```bash
# Seed all modules
npm run seed:all

# Or seed specific modules
npm run seed:module -- users --count=50 --clear
npm run seed:module -- products --count=25
```

### 7. Test Functions

```bash
# Trigger a function
npm run sandbox:trigger exampleHttpFunction '{"name":"Test User"}'

# Run scenarios
npm run sandbox:scenario userSignup
npm run sandbox:stress -- --operations=100 --type=read
```

## Customization

### Adding Custom Seed Modules

1. Create a new module in `sandbox/modules/`:

```typescript
// sandbox/modules/myModule.seed.ts
import { faker } from '@faker-js/faker';
import { SeedOptions, SeedResult } from './types';

export async function seedMyModule(options: SeedOptions = {}): Promise<SeedResult> {
  // Your seeding logic here
  return {
    module: 'myModule',
    created: 10,
    duration: 1000,
    success: true
  };
}
```

2. Add the module to `sandbox/sandbox.config.ts`:

```typescript
export function listModules(): string[] {
  return ['users', 'products', 'orders', 'config', 'myModule'];
}
```

3. Create a JSON template in `sandbox/seed-data/myModule.example.json`:

```json
{
  "categories": ["category1", "category2"],
  "settings": {
    "defaultValue": "example"
  }
}
```

### Adding Custom Cloud Functions

1. Add functions to `firebase/functions/src/index.ts`:

```typescript
export const myCustomFunction = functions.https.onCall(async (data, context) => {
  // Your function logic here
  return { message: 'Hello from custom function!' };
});
```

2. Update the function list in `components/Sandbox/FunctionTriggerPanel.tsx`:

```typescript
const availableFunctions: FunctionInfo[] = [
  // ... existing functions
  {
    name: 'myCustomFunction',
    description: 'My custom function',
    examplePayload: { input: 'example' }
  }
];
```

### Customizing the Admin Panel

1. **Add new tabs**: Edit `components/Sandbox/SandboxTabs.tsx`
2. **Add new components**: Create components in `components/Sandbox/`
3. **Add new API routes**: Create routes in `app/api/sandbox/`

## Common Use Cases

### Development Workflow

1. **Start development**:
   ```bash
   npm run sandbox:test
   ```

2. **Make changes** to your code

3. **Test changes**:
   ```bash
   npm run sandbox:health
   npm run seed:all
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Testing Workflow

1. **Reset environment**:
   ```bash
   npm run sandbox:reset
   ```

2. **Run tests**:
   ```bash
   npm run sandbox:stress -- --operations=1000 --type=mixed
   ```

3. **Check results** in the sandbox panel

### Deployment Workflow

1. **Export schema**:
   ```bash
   npm run schema:export
   ```

2. **Check for differences**:
   ```bash
   npm run schema:diff
   ```

3. **Deploy**:
   ```bash
   npm run deploy:prod
   ```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 8080, 9099, 5001, 4000 are available
2. **Permission errors**: Ensure Firestore rules allow writes
3. **Module not found**: Check that seed modules are properly exported
4. **Function not found**: Verify function names match exactly

### Getting Help

- Check the [Troubleshooting Guide](../docs/TROUBLESHOOTING.md)
- Review the [Getting Started Guide](../docs/GETTING_STARTED.md)
- Open an issue on GitHub

## Next Steps

- Customize the seed modules for your data
- Add your own Cloud Functions
- Configure CI/CD workflows
- Set up production Firebase project
- Deploy to Firebase Hosting

For more information, see the main [README](../README.md) and documentation files.

