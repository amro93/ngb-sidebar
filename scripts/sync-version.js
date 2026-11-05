const fs = require('fs');
const path = require('path');

// Read root package.json version
const rootPkgPath = path.join(__dirname, '..', 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
const version = rootPkg.version;

console.log(`Syncing version v${version} across library, docs and templates...`);

// 1. Sync projects/ngb-sidebar/package.json
const libPkgPath = path.join(__dirname, '..', 'projects', 'ngb-sidebar', 'package.json');
if (fs.existsSync(libPkgPath)) {
  const libPkg = JSON.parse(fs.readFileSync(libPkgPath, 'utf-8'));
  libPkg.version = version;
  fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2) + '\n');
}

// 2. Sync dist/ngb-sidebar/package.json if dist already exists
const distPkgPath = path.join(__dirname, '..', 'dist', 'ngb-sidebar', 'package.json');
if (fs.existsSync(distPkgPath)) {
  const distPkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf-8'));
  distPkg.version = version;
  fs.writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2) + '\n');
}

// 3. Sync src/version.ts
const versionTsPath = path.join(__dirname, '..', 'src', 'version.ts');
fs.writeFileSync(versionTsPath, `export const APP_VERSION = '${version}';\n`);

// 4. Sync the library version constant (used by NgbSidebarComponent.VERSION / NgbDrawerComponent.VERSION)
const libVersionPath = path.join(
  __dirname,
  '..',
  'projects',
  'ngb-sidebar',
  'src',
  'lib',
  'version.ts',
);
fs.writeFileSync(libVersionPath, `export const NGB_SIDEBAR_VERSION = '${version}';\n`);

console.log(`Successfully synced version v${version}!`);
