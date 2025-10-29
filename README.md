# 🔥 Firebase Sandbox Emulator Suite

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Template Repository](https://img.shields.io/badge/Template-Repository-blue.svg)](https://github.com/unstablelogic/firebase-sandbox-emulator-suite/generate)

**Plug-and-play Firebase sandbox toolkit** with emulators, modular seeding, schema sync + diff, CI guard, web admin panel, and scenario runner. Works with any Firebase app.

## ✨ Features

- 🔧 **Firebase Emulator Suite** - Local Firestore, Auth, Functions, and Hosting
- 🌱 **Modular Seeding System** - Hybrid Faker.js + JSON templates for realistic test data
- 🎨 **Web Admin Panel** - Interactive sandbox UI for browsing, seeding, and testing
- 📊 **Schema Sync & Diff** - Export, import, and compare Firestore rules and indexes
- 🛡️ **CI Pre-Deploy Guard** - Automated schema validation before deployment
- 🚀 **Scenario Runner** - Simulate real-world workflows and stress test your functions
- 📦 **Zero-Cost Development** - Everything runs locally with persistent state

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- Git

### Installation

1. **Use this template** (click "Use this template" button above) or clone:
   ```bash
   git clone https://github.com/unstablelogic/firebase-sandbox-emulator-suite.git
   cd firebase-sandbox-emulator-suite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.sandbox.example .env.local
   ```

4. **Start the sandbox:**
   ```bash
   npm run sandbox:start
   ```

5. **Open Emulator UI:**
   - Emulator UI: http://localhost:4000
   - Firestore: localhost:8080
   - Auth: localhost:9099
   - Functions: localhost:5001

6. **Seed test data:**
   ```bash
   # In a new terminal
   npm run seed:all
   ```

7. **Launch admin panel:**
   ```bash
   npm run sandbox:test
   ```
   - Admin Panel: http://localhost:3000/sandbox

## 📚 Documentation

- [Getting Started](docs/GETTING_STARTED.md) - Detailed setup and first run guide
- [Sandbox Admin Panel](docs/SANDBOX_ADMIN_PANEL.md) - Web interface features and usage
- [Schema Sync & CI](docs/SCHEMA_SYNC_AND_CI.md) - Schema management and deployment guards
- [Seeding & Scenarios](docs/SEEDING_AND_SCENARIOS.md) - Creating seed modules and test scenarios
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🎯 Key Commands

### Sandbox Management

```bash
# Start emulators with persistent state
npm run sandbox:start

# Start emulators + Next.js dev server
npm run sandbox:test

# Check emulator health
npm run sandbox:health

# Reset and reseed
npm run sandbox:reset

# Backup emulator state
npm run sandbox:backup
```

### Modular Seeding

```bash
# Seed all collections
npm run seed:all

# Seed specific module
npm run seed:module -- users --clear --count=50

# Seed authentication users
npm run seed:auth
```

### Schema Sync

```bash
# Export schema from production
npm run schema:export

# Import exported schema to local
npm run schema:import

# Compare local vs production
npm run schema:diff

# Full sync (export + import)
npm run schema:sync
```

### Automation & Testing

```bash
# Trigger a Cloud Function
npm run sandbox:trigger exampleHttpFunction payloads/user.json

# Run scenario
npm run sandbox:scenario

# Stress test
npm run sandbox:stress -- --operations=1000 --type=mixed --report
```

## 🌱 Seeding System

The template includes example seed modules for common data types:

- **users** - User profiles with roles (admin, user, guest)
- **products** - E-commerce items with categories
- **orders** - Order lifecycle with status workflow
- **config** - Application configuration and feature flags

Each module uses a hybrid approach:
- **Faker.js** for realistic dynamic data (names, emails, dates)
- **JSON templates** for project-specific structure

### Creating Custom Seed Modules

1. Copy an example: `cp sandbox/modules/users.seed.ts.example sandbox/modules/mydata.seed.ts`
2. Customize the data structure
3. Run: `npm run seed:module -- mydata --count=100`

See [Seeding & Scenarios](docs/SEEDING_AND_SCENARIOS.md) for details.

## 🎨 Web Admin Panel

Access the interactive sandbox panel at **http://localhost:3000/sandbox** (emulator mode only).

**Features:**
- **Collections Tab** - Browse and inspect Firestore data with pagination
- **Seeding Tab** - Reseed individual modules or all at once
- **Functions Tab** - Trigger Cloud Functions with custom payloads
- **Console Tab** - View real-time logs and export activity

The panel is only accessible when `NEXT_PUBLIC_FIREBASE_EMULATOR=true` to prevent accidental production use.

## 🛡️ CI Pre-Deploy Guard

The template includes a GitHub Actions workflow that:

1. Exports schema from your production Firebase project
2. Compares it with your local schema
3. **Blocks deployment** if there's a mismatch
4. Allows manual override with `--force` flag

Set up in 3 steps:

1. Add Firebase credentials to GitHub Secrets
2. Enable the workflow in `.github/workflows/deploy-guard.yml`
3. Push to main branch

See [Schema Sync & CI](docs/SCHEMA_SYNC_AND_CI.md) for setup instructions.

## 🧪 Verification Checklist

After setup, verify everything works:

- [ ] Emulators start successfully (`npm run sandbox:start`)
- [ ] Emulator UI accessible at http://localhost:4000
- [ ] Seed data populates Firestore (`npm run seed:all`)
- [ ] Admin panel loads at http://localhost:3000/sandbox
- [ ] Collections tab displays seeded data
- [ ] Seeding tab can reseed modules
- [ ] Functions tab can trigger example functions
- [ ] Health check passes (`npm run sandbox:health`)
- [ ] Stress test completes (`npm run sandbox:stress -- --operations=100 --type=read`)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

This project uses **Conventional Commits** for automated releases:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `chore:` - Build/tooling changes

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with:
- [Firebase](https://firebase.google.com/) - Backend platform
- [Next.js](https://nextjs.org/) - React framework
- [Faker.js](https://fakerjs.dev/) - Test data generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Ready to build?** Start with `npm run sandbox:test` and open http://localhost:3000/sandbox

For detailed setup instructions, see [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)

