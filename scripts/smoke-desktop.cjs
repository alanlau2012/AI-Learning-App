const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const smokeProfileRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-learning-app-smoke-'));
const isWindows = process.platform === 'win32';


function runBin(binName, args, extraEnv = {}) {
  const binPath = path.join(root, 'node_modules', '.bin', `${binName}${isWindows ? '.cmd' : ''}`);
  const env = { ...process.env, ...extraEnv };
  const result = spawnSync(binPath, args, {
    cwd: root,
    env,
    stdio: 'inherit',
    shell: isWindows,
  });

  if (result.error) {
    console.error(result.error);
  }
  return result.status ?? 1;
}

let exitCode = 0;
try {
  exitCode = runBin('vite', ['build', '--mode', 'desktop']);
  if (exitCode === 0) {
    exitCode = runBin('electron', ['.', '--smoke-test'], {
      ELECTRON_FORCE_PROD: '1',
      ELECTRON_SMOKE_PROFILE_ROOT: smokeProfileRoot,
    });
  }
} finally {
  fs.rmSync(smokeProfileRoot, { recursive: true, force: true });
}

process.exit(exitCode);
