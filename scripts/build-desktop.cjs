const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const tempOutput = path.join(os.tmpdir(), 'ai-learning-app-electron-builder');
const releaseOutput = path.join(root, 'release');

function assertInside(parent, target) {
  const relative = path.relative(parent, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to operate outside ${parent}: ${target}`);
  }
}

fs.rmSync(tempOutput, { recursive: true, force: true });
fs.mkdirSync(tempOutput, { recursive: true });

const builderArgs = [
  'electron-builder',
  '--win',
  'nsis',
  'portable',
  `--config.directories.output=${tempOutput}`,
];

const result = process.platform === 'win32'
  ? spawnSync('cmd.exe', ['/d', '/s', '/c', `npx ${builderArgs.join(' ')}`], { stdio: 'inherit' })
  : spawnSync('npx', builderArgs, { stdio: 'inherit', shell: false });

if (result.error) {
  console.error(result.error);
}
if (result.status !== 0) {
  console.error(`electron-builder exited with status ${result.status}`);
  process.exit(result.status ?? 1);
}

assertInside(root, releaseOutput);
fs.rmSync(releaseOutput, { recursive: true, force: true });
fs.mkdirSync(releaseOutput, { recursive: true });
fs.cpSync(tempOutput, releaseOutput, { recursive: true });
console.log(`Desktop release artifacts copied to ${releaseOutput}`);
