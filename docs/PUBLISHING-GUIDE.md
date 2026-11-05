# Publishing Guide: `@amro93/ngb-sidebar`

This guide explains how to version and publish the `@amro93/ngb-sidebar` package to the
[npm Registry](https://www.npmjs.com/package/@amro93/ngb-sidebar).

---

## 1. Quick Command Summary

| Command                 | Action                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `npm run publish:patch` | Bumps patch version (`0.1.x` $\rightarrow$ `0.1.x+1`), syncs all files, builds, and publishes |
| `npm run publish:minor` | Bumps minor version (`0.x.0` $\rightarrow$ `0.x+1.0`), syncs all files, builds, and publishes |
| `npm run publish:major` | Bumps major version (`x.0.0` $\rightarrow$ `x+1.0.0`), syncs all files, builds, and publishes |
| `npm run publish:lib`   | Builds and publishes the current version without bumping                                      |
| `npm run version:patch` | Bumps patch version and syncs files locally without publishing                                |
| `npm run sync:version`  | Copies the root version to the library manifest and the version constants                     |
| `npm run build:lib`     | Compiles the library package into `dist/ngb-sidebar`                                          |

---

## 2. First Release (one time, manual)

npm only lets you configure a Trusted Publisher for a package that already exists, so the very first
version has to be published from your machine:

```bash
npm login            # username amro93, password, 2FA code
npm whoami           # verify
npm run publish:lib  # builds and runs: npm publish ./dist/ngb-sidebar --access public
```

Then enable automated publishing:

1. On npmjs.com open **@amro93/ngb-sidebar → Settings → Trusted Publisher**.
2. Choose **GitHub Actions**, owner `amro93`, repository `ngb-sidebar`, workflow `npm-publish.yml`.
3. In GitHub **Settings → Pages**, set **Source: GitHub Actions** (used by the demo deploy).

---

## 3. Publishing Methods

### Method A: Automated via GitHub Actions (Recommended)

The repository is configured with **GitHub Actions & OIDC Trusted Publishing**
(`.github/workflows/npm-publish.yml`).

1. Bump the version and commit:
   ```bash
   npm run version:patch
   git add .
   git commit -m "chore: release v0.1.1"
   ```
2. Push to GitHub:
   ```bash
   git push origin master
   ```
3. GitHub Actions automatically:
   - Runs unit tests and the library build on Node 20.x and 22.x.
   - Compiles the library with `ng-packagr`.
   - Checks if the version is already on npm (and skips if so).
   - Publishes to the npm registry with provenance using OIDC (no tokens stored anywhere).
   - After CI is green, builds the demo and deploys it to GitHub Pages
     (`https://amro93.github.io/ngb-sidebar/`).

---

### Method B: Manual Local Publishing via CLI

#### Step 1: Log in to npm (One-Time per Machine)

```bash
npm login
```

_Enter your npm username (`amro93`), password, and 2FA code if prompted. Verify with `npm whoami`._

#### Step 2: Run the All-In-One Publish Command

```bash
npm run publish:patch
```

_This command automatically executes:_

1. `npm version patch` (bumps `package.json` and `package-lock.json`).
2. `node ./scripts/sync-version.js` (syncs `projects/ngb-sidebar/package.json`, `src/version.ts` and
   `projects/ngb-sidebar/src/lib/version.ts`).
3. `npm run build:lib` (compiles to `./dist/ngb-sidebar`).
4. `npm publish ./dist/ngb-sidebar --access public` (uploads to npm).

---

## 4. Before Publishing

```bash
npm run prettier:check
npm test
npm run build:lib
cd dist/ngb-sidebar && npm pack --dry-run   # inspect the tarball contents
```

The tarball should contain `LICENSE`, `README.md`, `package.json`, `fesm2022/` and `types/`.

---

## 5. Troubleshooting Common Errors

### `404 Not Found - PUT https://registry.npmjs.org/@amro93%2fngb-sidebar` / `401 Unauthorized`

- **Cause**: Your local npm CLI is not logged in or your session has expired.
- **Solution**: Run `npm login` and verify with `npm whoami`.

### `ENEEDAUTH` in GitHub Actions

- **Cause**: The Trusted Publisher is not configured on npmjs.com, or the workflow file name / repository
  does not match it.
- **Solution**: Re-check step 2 of the first release. The workflow upgrades npm to a version with OIDC
  support (>= 11.5.1) — keep that step.

### `npm error command git ls-remote ssh://git@github.com/dist/ngb-sidebar.git`

- **Cause**: Running `npm publish dist/ngb-sidebar` without `./` makes npm treat the path as a GitHub
  shortcut.
- **Solution**: Always use `npm publish ./dist/ngb-sidebar --access public` (already in `publish:lib`).

### Version Out of Sync

- **Cause**: Editing `package.json` manually without updating `projects/ngb-sidebar/package.json`.
- **Solution**: Run `npm run sync:version` to synchronize the root project, library manifest, TypeScript
  version constants and (if present) the distribution bundle.
