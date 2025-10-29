# Contributing to firebase-sandbox-emulator-suite

We welcome improvements and new ideas! Please follow these quick guidelines to keep the template consistent and easy to maintain.

## 🧱 Project Setup

1. **Fork & clone** this repository.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Start the local sandbox to verify changes:
   ```bash
   npm run sandbox:test
   ```

## ✍️ Commit Conventions

This project uses **Conventional Commits** to auto-generate changelogs.

Format:
```
<type>(optional scope): <short summary>
```

Common types:
- **feat:** new feature
- **fix:** bug fix
- **docs:** documentation only
- **chore:** build or tooling changes
- **refactor:** code improvement without new feature
- **test:** adding or fixing tests

Example:
```
feat(seeding): add clear flag to seed command
```

## 🧪 Testing Your Changes

Run local validation before opening a PR:

```bash
npm run lint
npm run sandbox:health
npm run schema:diff
```

## 📨 Pull Requests

1. Create a feature branch (`feat/my-feature`).
2. Push and open a pull request into `main`.
3. Ensure all checks (lint, CI, schema guard) pass.

PR titles should match Conventional Commit format so releases include them.

## 🚀 Releases

Releases are handled automatically by GitHub Actions and **semantic-release**. When a PR is merged to `main`, semantic-release:

- Analyzes commit messages
- Bumps the version (major / minor / patch)
- Generates or updates `CHANGELOG.md`
- Creates a GitHub release with notes and tag (e.g., `v1.2.0`)

Manual versioning is not required—just follow Conventional Commits!

## 🧾 License

This project is MIT-licensed. By contributing, you agree your contributions will be released under the same license.

