# Troubleshooting

This guide helps you resolve common issues when using the Firebase Sandbox Emulator Suite.

## Port Conflicts

### Emulator Ports Already in Use

**Error:** "Port 8080 is not open on localhost"

**Solutions:**
1. **Stop existing emulators:**
   ```bash
   # Find and kill processes using the ports
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   ```

2. **Use different ports:**
   ```json
   // firebase.json
   {
     "emulators": {
       "firestore": { "port": 8081 },
       "auth": { "port": 9090 },
       "functions": { "port": 5002 }
     }
   }
   ```

3. **Restart your computer** (if processes won't terminate)

### Next.js Port Conflicts

**Error:** "Port 3000 is already in use"

**Solutions:**
1. **Kill existing Next.js process:**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Use different port:**
   ```bash
   npm run dev -- -p 3001
   ```

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

## Emulator Connection Issues

### Emulators Won't Start

**Error:** "Could not start Emulator UI"

**Solutions:**
1. **Check Firebase CLI version:**
   ```bash
   firebase --version
   npm install -g firebase-tools@latest
   ```

2. **Verify Node.js version:**
   ```bash
   node --version  # Should be 20+
   ```

3. **Clear emulator data:**
   ```bash
   npm run sandbox:reset
   ```

4. **Check available ports:**
   ```bash
   npm run sandbox:health
   ```

### Emulator UI Not Loading

**Issue:** http://localhost:4000 shows blank page

**Solutions:**
1. **Check emulator status:**
   ```bash
   npm run sandbox:health
   ```

2. **Restart emulators:**
   ```bash
   npm run sandbox:start
   ```

3. **Clear browser cache** and reload

4. **Try different browser** or incognito mode

### Functions Emulator Issues

**Error:** "Functions emulator not responding"

**Solutions:**
1. **Check Functions emulator logs:**
   ```bash
   # Look for errors in terminal output
   ```

2. **Verify function code compiles:**
   ```bash
   cd firebase/functions
   npm run build
   ```

3. **Check function URLs:**
   - Functions emulator: http://localhost:5001
   - Function endpoint: http://localhost:5001/demo-project/us-central1/functionName

## Seeding Problems

### Permission Denied Errors

**Error:** "PERMISSION_DENIED: false for 'create'"

**Solutions:**
1. **Check Firestore rules:**
   ```javascript
   // firebase.rules - ensure rules allow writes
   match /{document=**} {
     allow read, write: if true; // For development only
   }
   ```

2. **Verify emulator connection:**
   ```bash
   npm run sandbox:health
   ```

3. **Check environment variables:**
   ```bash
   # Ensure NEXT_PUBLIC_FIREBASE_EMULATOR=true
   ```

### Seed Modules Not Found

**Error:** "Cannot find module 'users.seed'"

**Solutions:**
1. **Check file exists:**
   ```bash
   ls sandbox/modules/
   ```

2. **Verify export name:**
   ```typescript
   // Should export function with same name as file
   export async function seedUsers() { ... }
   ```

3. **Check TypeScript compilation:**
   ```bash
   npm run type-check
   ```

### Faker.js Errors

**Error:** "faker.person.fullName is not a function"

**Solutions:**
1. **Update Faker.js version:**
   ```bash
   npm install @faker-js/faker@latest
   ```

2. **Check API changes:**
   ```typescript
   // Old API
   faker.name.fullName()
   
   // New API
   faker.person.fullName()
   ```

## Admin Panel Issues

### Panel Won't Load

**Error:** "Not in emulator mode"

**Solutions:**
1. **Check environment variable:**
   ```bash
   echo $NEXT_PUBLIC_FIREBASE_EMULATOR
   # Should be "true"
   ```

2. **Restart Next.js:**
   ```bash
   npm run sandbox:test
   ```

3. **Clear browser cache**

### API Routes Not Working

**Error:** "404 Not Found" for API routes

**Solutions:**
1. **Check route files exist:**
   ```bash
   ls app/api/sandbox/
   ```

2. **Verify Next.js is running:**
   ```bash
   # Check http://localhost:3000/api/sandbox/seed
   ```

3. **Check route exports:**
   ```typescript
   // app/api/sandbox/seed/route.ts
   export async function POST(request: Request) { ... }
   ```

### Components Not Rendering

**Error:** "Export default doesn't exist"

**Solutions:**
1. **Check component exports:**
   ```typescript
   // Should have default export
   export default function ComponentName() { ... }
   ```

2. **Verify import paths:**
   ```typescript
   import ComponentName from '@/components/ComponentName';
   ```

3. **Check TypeScript compilation:**
   ```bash
   npm run type-check
   ```

## Schema Sync Issues

### Export Fails

**Error:** "Command failed: firebase firestore:rules"

**Solutions:**
1. **Authenticate Firebase CLI:**
   ```bash
   firebase login
   ```

2. **Check project ID:**
   ```bash
   firebase projects:list
   ```

3. **Verify permissions:**
   - Ensure you have read access to Firestore rules
   - Check project billing is enabled

### Import Fails

**Error:** "Cannot read exported files"

**Solutions:**
1. **Run export first:**
   ```bash
   npm run schema:export
   ```

2. **Check export directory:**
   ```bash
   ls firebase/schema-sync/exports/
   ```

3. **Verify file permissions**

### Diff Shows False Positives

**Issue:** Diff reports differences that don't exist

**Solutions:**
1. **Check file encoding** (should be UTF-8)
2. **Remove trailing whitespace**
3. **Verify line endings** (Unix vs Windows)
4. **Clear export cache and re-export**

## CI/CD Problems

### GitHub Actions Authentication Fails

**Error:** "Authentication failed"

**Solutions:**
1. **Check secrets are set:**
   - Go to GitHub → Settings → Secrets and variables → Actions
   - Verify `FIREBASE_PROJECT_ID` is set
   - Verify `FIREBASE_SERVICE_ACCOUNT` or `FIREBASE_TOKEN` is set

2. **Test authentication locally:**
   ```bash
   firebase projects:list
   ```

3. **Check Service Account JSON format:**
   ```json
   {
     "type": "service_account",
     "project_id": "your-project",
     ...
   }
   ```

### Workflow Not Triggering

**Issue:** GitHub Actions not running

**Solutions:**
1. **Check workflow file exists:**
   ```bash
   ls .github/workflows/
   ```

2. **Verify trigger conditions:**
   ```yaml
   on:
     push:
       branches: [main]
   ```

3. **Check branch name** (should be `main`, not `master`)

### Deployment Blocked

**Issue:** CI blocks deployment due to schema mismatch

**Solutions:**
1. **Fix schema locally:**
   ```bash
   npm run schema:export
   npm run schema:import
   git add firebase.rules firebase.indexes.json
   git commit -m "fix(schema): sync with production"
   git push
   ```

2. **Use force override** (emergency only):
   ```bash
   gh workflow run deploy-guard.yml -f force=true
   ```

## Performance Issues

### Slow Emulator Performance

**Issue:** Emulators are slow or unresponsive

**Solutions:**
1. **Increase system resources:**
   - Close other applications
   - Increase available RAM
   - Use SSD storage

2. **Reduce data volume:**
   ```bash
   npm run seed:all -- --count=10
   ```

3. **Clear emulator data regularly:**
   ```bash
   npm run sandbox:reset
   ```

### Slow Seeding

**Issue:** Seed operations take too long

**Solutions:**
1. **Use batch operations:**
   ```typescript
   // Instead of individual adds
   const batch = writeBatch(db);
   docs.forEach(doc => batch.set(docRef, doc));
   await batch.commit();
   ```

2. **Reduce document complexity**
3. **Use parallel operations where possible**

### Memory Issues

**Error:** "JavaScript heap out of memory"

**Solutions:**
1. **Increase Node.js memory:**
   ```bash
   node --max-old-space-size=4096 scripts/seedAll.ts
   ```

2. **Reduce batch sizes**
3. **Process data in chunks**

## Environment Issues

### Environment Variables Not Loading

**Issue:** `process.env` variables are undefined

**Solutions:**
1. **Check file exists:**
   ```bash
   ls .env.local
   ```

2. **Verify variable names:**
   ```bash
   # Should start with NEXT_PUBLIC_ for client-side
   NEXT_PUBLIC_FIREBASE_EMULATOR=true
   ```

3. **Restart development server:**
   ```bash
   npm run sandbox:test
   ```

### TypeScript Errors

**Error:** "Cannot find module" or type errors

**Solutions:**
1. **Install missing dependencies:**
   ```bash
   npm install @types/node @types/react
   ```

2. **Check tsconfig.json paths:**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

3. **Restart TypeScript server** in your editor

## Getting Help

### Debug Steps

1. **Check emulator health:**
   ```bash
   npm run sandbox:health
   ```

2. **View emulator logs:**
   - Check terminal output for errors
   - Look at `firestore-debug.log`
   - Check browser console for client errors

3. **Test individual components:**
   ```bash
   npm run seed:users
   npm run sandbox:trigger exampleHttpFunction
   ```

4. **Verify environment:**
   ```bash
   node --version
   npm --version
   firebase --version
   ```

### Common Solutions

1. **Restart everything:**
   ```bash
   npm run sandbox:reset
   npm run sandbox:test
   ```

2. **Clear all caches:**
   ```bash
   rm -rf .next node_modules
   npm install
   ```

3. **Check file permissions**
4. **Update dependencies**
5. **Check system resources**

### When to Ask for Help

- Error persists after trying solutions
- Unusual error messages not covered here
- Performance issues not resolved
- Setup problems on specific operating systems

### Providing Debug Information

When asking for help, include:

1. **Error message** (exact text)
2. **Steps to reproduce**
3. **Environment details:**
   ```bash
   node --version
   npm --version
   firebase --version
   ```
4. **Relevant log files**
5. **What you've already tried**

For more information, see the [Getting Started Guide](GETTING_STARTED.md) and other documentation files.

