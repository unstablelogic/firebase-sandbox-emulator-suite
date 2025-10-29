# Schema Sync & CI Guard

This guide covers the schema synchronization system and CI pre-deploy guard that ensures your local Firebase configuration stays in sync with production.

## Overview

The schema sync system provides three main tools:

- **Export** - Download Firestore rules and indexes from production
- **Import** - Apply exported schema to local configuration
- **Diff** - Compare local vs production schema

The CI guard automatically runs schema validation before deployments, blocking releases if there are mismatches.

## Schema Sync Tools

### Export Schema

Export rules and indexes from your production Firebase project:

```bash
npm run schema:export
```

This command:
- Downloads Firestore rules from production
- Downloads Firestore indexes from production
- Saves files to `/firebase/schema-sync/exports/`
- Uses your Firebase CLI authentication

**Requirements:**
- Firebase CLI installed and authenticated
- Access to the production Firebase project
- Project ID specified in environment or CLI argument

### Import Schema

Apply exported schema to your local configuration:

```bash
npm run schema:import
```

This command:
- Reads exported rules and indexes
- Backs up existing local files
- Copies exported files to `/firebase/` directory
- Shows diff before applying changes

### Compare Schema

Check for differences between local and production:

```bash
npm run schema:diff
```

This command:
- Compares local rules vs exported rules
- Compares local indexes vs exported indexes
- Shows detailed diff output
- Exits with code 1 if mismatches found

### Full Sync

Export and import in one command:

```bash
npm run schema:sync
```

## CI Pre-Deploy Guard

The CI guard workflow automatically validates schema before deployments.

### Workflow Overview

The `.github/workflows/deploy-guard.yml` workflow:

1. **Triggers** on push to main branch or manual dispatch
2. **Authenticates** with Firebase using Service Account or Token
3. **Exports** schema from production project
4. **Compares** local vs production schema
5. **Blocks deployment** if mismatches found
6. **Allows override** with `--force` flag
7. **Sends notifications** via Slack/Discord (optional)

### Setting Up Authentication

You have two options for Firebase authentication:

#### Option 1: Service Account (Recommended)

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Add to GitHub Secrets as `FIREBASE_SERVICE_ACCOUNT`
5. Set `FIREBASE_PROJECT_ID` secret

#### Option 2: Firebase Token

1. Run `firebase login:ci` locally
2. Copy the generated token
3. Add to GitHub Secrets as `FIREBASE_TOKEN`
4. Set `FIREBASE_PROJECT_ID` secret

### Enabling the Workflow

1. Copy `.github/workflows/deploy-guard.yml` to your repository
2. Update the workflow file with your project details
3. Add required secrets to GitHub repository settings
4. Enable the workflow in GitHub Actions

### Force Override

In emergency situations, you can bypass the schema check:

```bash
# Manual dispatch with force flag
gh workflow run deploy-guard.yml -f force=true
```

Or modify the workflow to allow force deployments.

## Configuration

### Environment Variables

Required for schema sync:

```bash
# Production Firebase project
FIREBASE_PROJECT_ID=your-production-project

# Authentication (choose one)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
# OR
FIREBASE_TOKEN=your-firebase-token
```

### GitHub Secrets

Add these to your repository secrets:

- `FIREBASE_PROJECT_ID` - Your production Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT` - Service account JSON (preferred)
- `FIREBASE_TOKEN` - Firebase CI token (alternative)
- `SLACK_WEBHOOK_URL` - Optional Slack notifications
- `DISCORD_WEBHOOK_URL` - Optional Discord notifications

## Usage Examples

### Daily Development Workflow

1. **Start development:**
   ```bash
   npm run sandbox:start
   ```

2. **Make schema changes locally:**
   - Edit `firebase.rules`
   - Update `firebase.indexes.json`

3. **Test changes:**
   ```bash
   npm run sandbox:test
   ```

4. **Before committing:**
   ```bash
   npm run schema:diff
   ```

5. **If diff shows changes:**
   ```bash
   npm run schema:export
   npm run schema:import
   ```

### Production Deployment Workflow

1. **Push to main branch**
2. **CI automatically runs schema validation**
3. **If schema matches:** Deployment proceeds
4. **If schema differs:** Deployment blocked with error message
5. **Fix schema locally and retry**

### Emergency Deployment

If you need to deploy despite schema differences:

1. **Use force override:**
   ```bash
   gh workflow run deploy-guard.yml -f force=true
   ```

2. **Or temporarily disable the guard**
3. **Fix schema issues after deployment**

## Troubleshooting

### Export Fails

**Error:** "Command failed: firebase firestore:rules"

**Solutions:**
- Verify Firebase CLI is authenticated: `firebase login`
- Check project ID is correct
- Ensure you have permissions to read rules/indexes
- Try with explicit project: `firebase firestore:rules --project your-project`

### Import Fails

**Error:** "Cannot read exported files"

**Solutions:**
- Run export first: `npm run schema:export`
- Check `/firebase/schema-sync/exports/` directory exists
- Verify exported files are not empty
- Check file permissions

### Diff Shows False Positives

**Issue:** Diff reports differences that don't exist

**Solutions:**
- Ensure local files are saved
- Check for whitespace differences
- Verify file encoding (UTF-8)
- Clear export cache and re-export

### CI Authentication Fails

**Error:** "Authentication failed"

**Solutions:**
- Verify secrets are set correctly in GitHub
- Check Service Account JSON format
- Ensure project ID matches
- Test authentication locally first

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

2. **Use force override** (emergency only)
3. **Check if changes are intentional**

## Best Practices

### Schema Management

1. **Always test locally first** - Use emulators to validate changes
2. **Export before major changes** - Keep production schema as reference
3. **Commit schema files** - Include rules and indexes in version control
4. **Document changes** - Explain why schema modifications were made
5. **Review diffs carefully** - Understand what changed before importing

### CI/CD Integration

1. **Enable the guard early** - Set up CI validation from project start
2. **Monitor notifications** - Set up Slack/Discord alerts
3. **Test force override** - Ensure emergency procedures work
4. **Document overrides** - Log when and why force deployments were used
5. **Regular audits** - Periodically review schema changes

### Team Workflow

1. **Assign schema ownership** - Designate who can modify production schema
2. **Use feature branches** - Test schema changes before merging
3. **Code review required** - Require review for schema modifications
4. **Documentation updates** - Update docs when schema changes
5. **Training** - Ensure team understands schema sync process

## Advanced Configuration

### Custom Export Paths

Modify export script to save to different locations:

```typescript
// firebase/schema-sync/exportSchema.ts
const exportPath = process.env.SCHEMA_EXPORT_PATH || './firebase/schema-sync/exports';
```

### Multiple Environments

Support multiple Firebase projects:

```bash
# Development
npm run schema:export -- --project dev-project

# Staging  
npm run schema:export -- --project staging-project

# Production
npm run schema:export -- --project prod-project
```

### Automated Notifications

Configure webhook notifications for schema changes:

```yaml
# .github/workflows/deploy-guard.yml
- name: Notify Schema Change
  if: ${{ steps.diff.outcome == 'failure' }}
  run: |
    curl -X POST "${{ secrets.SLACK_WEBHOOK_URL }}" \
      -H "Content-Type: application/json" \
      -d '{"text":"Schema mismatch detected in deployment"}'
```

For more information, see the [Getting Started Guide](GETTING_STARTED.md) and [Troubleshooting](TROUBLESHOOTING.md).

