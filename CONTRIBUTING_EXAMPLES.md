# Contributing Examples

This guide provides concrete examples of commit messages, PR titles, and common contribution scenarios.

## Commit Message Examples

### Feature Additions

```bash
feat(seeding): add pagination support to seed modules
feat(admin-panel): implement real-time collection updates
feat(scenarios): add bulk import scenario
feat: add support for Realtime Database emulator
```

### Bug Fixes

```bash
fix(seeding): resolve duplicate key error in users module
fix(admin-panel): correct pagination offset calculation
fix(schema-sync): handle missing indexes file gracefully
fix: prevent emulator port conflicts on Windows
```

### Documentation

```bash
docs(readme): add troubleshooting section for port conflicts
docs(seeding): clarify Faker vs template usage
docs: update installation prerequisites
docs(contributing): add commit message examples
```

### Chores and Maintenance

```bash
chore(deps): update Firebase SDK to v10.12.0
chore: configure Prettier formatting rules
chore(ci): add automated release workflow
chore: update .gitignore for sandbox logs
```

### Refactoring

```bash
refactor(seeding): extract common seed logic to base class
refactor(api): simplify error handling in routes
refactor: migrate to TypeScript strict mode
```

### Tests

```bash
test(seeding): add unit tests for seed orchestrator
test(scenarios): add stress test validation
test: increase test coverage to 80%
```

## Pull Request Title Examples

PR titles follow the same Conventional Commit format:

### Good PR Titles

```
feat(admin-panel): add export functionality to Collections tab
fix(seeding): resolve Auth emulator connection timeout
docs(getting-started): add Windows-specific setup instructions
chore(deps): upgrade Next.js to v14.2.0
```

### Bad PR Titles

```
❌ Update files
❌ Fix bug
❌ Changes to admin panel
❌ WIP - testing new feature
```

## Common Contribution Scenarios

### Adding a New Seed Module

1. Create the seed file:
   ```bash
   cp sandbox/modules/users.seed.ts.example sandbox/modules/mydata.seed.ts
   ```

2. Implement your seeding logic

3. Add JSON template:
   ```bash
   cp sandbox/seed-data/users.example.json sandbox/seed-data/mydata.example.json
   ```

4. Test locally:
   ```bash
   npm run seed:module -- mydata --count=10
   ```

5. Commit:
   ```bash
   git add sandbox/modules/mydata.seed.ts sandbox/seed-data/mydata.example.json
   git commit -m "feat(seeding): add mydata seed module"
   ```

### Fixing a Bug

1. Create a branch:
   ```bash
   git checkout -b fix/describe-the-bug
   ```

2. Make your changes

3. Test the fix:
   ```bash
   npm run lint
   npm run sandbox:health
   ```

4. Commit with descriptive message:
   ```bash
   git commit -m "fix(component): resolve issue with XYZ

   - Added null check for edge case
   - Updated error handling
   - Added test case

   Fixes #123"
   ```

5. Push and create PR:
   ```bash
   git push origin fix/describe-the-bug
   ```

### Improving Documentation

1. Edit the relevant docs file

2. Preview locally (for README changes):
   ```bash
   # View in your editor or GitHub preview
   ```

3. Commit:
   ```bash
   git commit -m "docs(getting-started): clarify emulator setup steps"
   ```

### Adding a New Scenario

1. Create scenario file:
   ```bash
   cp scripts/scenarios/stressTest.ts.example scripts/scenarios/myScenario.ts
   ```

2. Implement scenario logic

3. Create payload template if needed:
   ```bash
   touch scripts/payloads/myscenario.json
   ```

4. Add NPM script to `package.json`:
   ```json
   "sandbox:myscenario": "ts-node scripts/scenarios/myScenario.ts"
   ```

5. Test:
   ```bash
   npm run sandbox:myscenario
   ```

6. Commit:
   ```bash
   git commit -m "feat(scenarios): add myScenario automation test"
   ```

## Best Practices

### Commit Messages

- **Be specific**: "fix(seeding): handle empty user array" not "fix bug"
- **Use imperative mood**: "add feature" not "added feature"
- **Reference issues**: Include "Fixes #123" or "Closes #456"
- **Keep first line under 72 characters**
- **Add body for complex changes**

### Code Style

- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use meaningful variable names

### Testing

- Test locally before pushing
- Run `npm run lint` to catch style issues
- Verify emulators start successfully
- Test seed operations complete without errors
- Check admin panel loads and functions work

### Documentation

- Update relevant docs when adding features
- Include code examples where helpful
- Add troubleshooting tips for common issues
- Keep language clear and concise

## Troubleshooting Contributions

### My PR Checks Are Failing

1. **Lint errors**: Run `npm run lint` locally and fix issues
2. **Build errors**: Run `npm run build` to catch TypeScript errors
3. **Test failures**: Run tests locally and fix failing cases

### I'm Not Sure What Type to Use

- **feat**: Adds new functionality users will see
- **fix**: Corrects existing functionality
- **docs**: Only changes documentation
- **refactor**: Improves code without changing behavior
- **chore**: Updates dependencies, configs, or tooling
- **test**: Adds or modifies tests

When in doubt, use `chore` for infrastructure changes or `docs` for documentation.

### My Commit History Is Messy

Before opening a PR, you can clean up commits:

```bash
# Interactive rebase to squash/edit commits
git rebase -i HEAD~3

# Or squash all commits in your branch
git rebase -i main
```

### I Need to Update My Branch

```bash
# Fetch latest changes
git fetch origin

# Rebase your branch on latest main
git rebase origin/main

# Force push (only on your feature branch!)
git push --force-with-lease
```

## Questions?

- Check existing issues and PRs for similar work
- Open a discussion issue before starting large changes
- Ask questions in your PR - we're happy to help!

## Thank You!

Every contribution, no matter how small, helps make this project better. We appreciate your time and effort! 🙏

