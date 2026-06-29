/**
 * Batch update GitHub issues #8–#66 with v2 handover bodies.
 * Usage:
 *   node scripts/generate-github-issue-bodies.mjs   # regenerate drafts first
 *   node scripts/update-audit-github-issues.mjs       # push to GitHub
 *   node scripts/update-audit-github-issues.mjs --dry-run
 *   node scripts/update-audit-github-issues.mjs --from 44 --to 47
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BODIES_DIR = join(process.cwd(), 'reports', 'github-issues');
const dryRun = process.argv.includes('--dry-run');
const fromArg = process.argv.indexOf('--from');
const toArg = process.argv.indexOf('--to');
const fromNum = fromArg >= 0 ? Number(process.argv[fromArg + 1]) : 8;
const toNum = toArg >= 0 ? Number(process.argv[toArg + 1]) : 66;

/** Map issue number → body filename */
const files = readdirSync(BODIES_DIR).filter((f) => f.endsWith('.md'));
const byNumber = new Map();
for (const file of files) {
  const m = file.match(/^issue-(\d+)-/);
  if (m) byNumber.set(Number(m[1]), file);
}

const missing = [];
for (let n = fromNum; n <= toNum; n++) {
  if (!byNumber.has(n)) missing.push(n);
}
if (missing.length) {
  console.error('Missing body files for:', missing.join(', '));
  process.exit(1);
}

const results = [];
for (let n = fromNum; n <= toNum; n++) {
  const file = byNumber.get(n);
  const bodyPath = join(BODIES_DIR, file);
  const body = readFileSync(bodyPath, 'utf8');

  if (dryRun) {
    console.log(`[dry-run] #${n} ← ${file} (${body.length} chars)`);
    results.push({ n, ok: true, dryRun: true });
    continue;
  }

  const tmp = join(tmpdir(), `gh-issue-edit-${n}-${Date.now()}.md`);
  writeFileSync(tmp, body, 'utf8');
  try {
    execFileSync('gh', ['issue', 'edit', String(n), '--body-file', tmp], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    console.log(`Updated #${n} ← ${file}`);
    results.push({ n, ok: true });
  } catch (err) {
    const msg = err.stderr?.toString() || err.message;
    console.error(`FAILED #${n}: ${msg}`);
    results.push({ n, ok: false, error: msg });
  } finally {
    try {
      unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

const ok = results.filter((r) => r.ok).length;
const fail = results.filter((r) => !r.ok).length;
console.log(`\nDone: ${ok} updated, ${fail} failed (${fromNum}–${toNum})`);
if (fail) process.exit(1);
