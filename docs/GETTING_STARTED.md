# Getting Started with Firebase Sandbox Emulator Suite

This guide will walk you through setting up and running the Firebase Sandbox Emulator Suite for the first time.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Firebase CLI** - Install globally:
  ```bash
  npm install -g firebase-tools
  ```
- **Git** - [Download here](https://git-scm.com/)

## Installation Steps

### 1. Get the Template

**Option A: Use as Template (Recommended)**
1. Click the "Use this template" button on GitHub
2. Create your own repository
3. Clone your new repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

**Option B: Clone Directly**
```bash
git clone https://github.com/unstablelogic/firebase-sandbox-emulator-suite.git
cd firebase-sandbox-emulator-suite
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Firebase SDK and Admin SDK
- TypeScript and development tools
- Faker.js for test data generation
- Semantic release tools

### 3. Configure Environment

For local development with emulators:

```bash
cp .env.sandbox.example .env.local
```

The `.env.sandbox.example` file contains pre-configured settings for the Firebase Emulator Suite with fake credentials. No changes needed for local development!

**For production Firebase project** (optional):
```bash
cp .env.example .env.production
# Edit .env.production with your real Firebase credentials
```

### 4. Initialize Firebase (Optional)

If you want to connect to a real Firebase project later:

```bash
firebase login
firebase init
```

Select:
- Firestore (rules and indexes)
- Functions (optional)
- Hosting (optional)

## First Run

### Start the Emulators

Open a terminal and start the Firebase Emulator Suite:

```bash
npm run sandbox:start
```

You should see output indicating all emulators are running:

```
┌────────────────┬────────────────┬──────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI              │
├────────────────┼────────────────┼──────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth       │
│ Functions      │ 127.0.0.1:5001 │ http://127.0.0.1:4000/functions  │
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore  │
│ Hosting        │ 127.0.0.1:5000 │ n/a                              │
└────────────────┴────────────────┴──────────────────────────────────┘
```

**Access the Emulator UI:** http://localhost:4000

### Seed Test Data

Open a **new terminal** (keep emulators running) and seed the database:

```bash
npm run seed:all
```

This will populate Firestore with example data:
- Users (with different roles)
- Products (e-commerce items)
- Orders (with status workflow)
- Config (application settings)

You can view the seeded data in the Emulator UI at http://localhost:4000/firestore

### Launch the Admin Panel

Start the Next.js development server:

```bash
npm run sandbox:test
```

This command starts both the emulators and the Next.js dev server using `concurrently`.

**Access the Admin Panel:** http://localhost:3000/sandbox

## Verification Checklist

Verify your setup is working correctly:

### 1. Emulator Health Check

```bash
npm run sandbox:health
```

Expected output:
```
✅ Port 8080 is listening (Firestore Emulator)
✅ Port 9099 is listening (Auth Emulator)
✅ Port 5001 is listening (Functions Emulator)
✅ Port 4000 is listening (Emulator UI)
```

### 2. Check Emulator UI

Visit http://localhost:4000 and verify:
- Firestore tab shows collections (users, products, orders, config)
- Auth tab shows seeded users
- Functions tab shows example functions

### 3. Test Admin Panel

Visit http://localhost:3000/sandbox and verify:
- **Collections Tab**: Browse seeded data with pagination
- **Seeding Tab**: Click "Reseed" buttons to regenerate data
- **Functions Tab**: Trigger example functions
- **Console Tab**: View logs and activity

### 4. Run a Stress Test

```bash
npm run sandbox:stress -- --operations=100 --type=read --report
```

Check that:
- Operations complete successfully
- Report is generated in `/sandbox-logs/`
- No errors in console

## Next Steps

Now that your sandbox is running, you can:

1. **Customize Seed Modules** - Edit files in `/sandbox/modules/` to match your data model
2. **Add Cloud Functions** - Create functions in `/firebase/functions/src/`
3. **Create Scenarios** - Write test scenarios in `/scripts/scenarios/`
4. **Set Up CI Guard** - Configure schema validation for deployments

## Common Issues

### Port Already in Use

If you see "Port XXXX is not open":

1. Stop any running emulators: `Ctrl+C` in the emulator terminal
2. Check for processes using the port:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:8080 | xargs kill -9
   ```
3. Restart emulators: `npm run sandbox:start`

### Emulators Won't Start

1. Ensure Firebase CLI is installed: `firebase --version`
2. Check Node.js version: `node --version` (should be 20+)
3. Clear emulator data: `npm run sandbox:reset`

### Admin Panel Shows "Not in Emulator Mode"

1. Verify `.env.local` exists and contains:
   ```
   NEXT_PUBLIC_FIREBASE_EMULATOR=true
   ```
2. Restart the Next.js dev server
3. Clear browser cache and reload

### Seeding Fails with Permission Errors

1. Ensure emulators are running
2. Check that `firestore.rules` allows writes in development
3. Verify you're connected to emulators, not production

## Getting Help

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more solutions
- Review [Firebase Emulator documentation](https://firebase.google.com/docs/emulator-suite)
- Open an issue on GitHub

## What's Next?

- [Sandbox Admin Panel Guide](SANDBOX_ADMIN_PANEL.md)
- [Schema Sync & CI Setup](SCHEMA_SYNC_AND_CI.md)
- [Creating Seed Modules](SEEDING_AND_SCENARIOS.md)

