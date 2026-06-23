/**
 * Verify prefill/decode/ttft narrow viewport overflow using local Chrome CDP (no extra browser download).
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME =
  process.env.CHROME_PATH ??
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.env.BASE_URL ?? 'http://localhost:5174';
const PORT = Number(process.env.CDP_PORT ?? 9333);
const SLUGS = ['prefill', 'decode', 'ttft'];

class CdpSession {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve, { once: true });
      ws.addEventListener('error', reject, { once: true });
    });
    return new CdpSession(ws);
  }
}

async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await sleep(500);
  }
  throw new Error(`Dev server not reachable at ${BASE}`);
}

function launchChrome(width, height) {
  return spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${PORT}`,
      `--window-size=${width},${height}`,
    ],
    { stdio: 'ignore' },
  );
}

async function openTarget(url) {
  const res = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error(`Failed to open target: ${res.status}`);
  return res.json();
}

async function checkSlug(slug, width, height) {
  const url = `${BASE}/concepts/${slug}`;
  const target = await openTarget(url);
  const session = await CdpSession.connect(target.webSocketDebuggerUrl);

  await session.send('Page.enable');
  await session.send('Runtime.enable');
  await session.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });

  await session.send('Page.navigate', { url });
  await sleep(1200);

  await session.send('Runtime.evaluate', {
    expression: `(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('下一步'));
      return !!btn;
    })()`,
    awaitPromise: false,
  });

  for (let i = 0; i < 20; i++) {
    const { result } = await session.send('Runtime.evaluate', {
      expression: `(() => {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('下一步'));
        return !!btn;
      })()`,
    });
    if (result.value) break;
    await sleep(500);
  }

  const { result } = await session.send('Runtime.evaluate', {
    expression: `(() => {
      const doc = document.documentElement;
      const pageOverflow = Math.max(0, doc.scrollWidth - doc.clientWidth);
      const canvas = document.querySelector('[class*="canvas"]');
      const canvasOverflow = canvas
        ? Math.max(0, canvas.scrollWidth - canvas.clientWidth)
        : 0;
      return {
        pageOverflow,
        canvasOverflow,
        canvasWidth: canvas ? canvas.clientWidth : null,
        canvasFound: !!canvas,
      };
    })()`,
    returnByValue: true,
  });

  await session.send('Page.close');
  session.ws.close();

  return { slug, ...result.value };
}

async function runViewport(width, height, label) {
  const chrome = launchChrome(width, height);
  await sleep(1500);

  const results = [];
  try {
    for (const slug of SLUGS) {
      results.push(await checkSlug(slug, width, height));
    }
  } finally {
    chrome.kill();
    await sleep(300);
  }

  return { label, results };
}

await waitForServer();

let failed = false;

const narrow = await runViewport(390, 820, 'narrow');
const desktop = await runViewport(1280, 900, 'desktop');

console.log('=== Narrow (390×820) — local Chrome CDP ===');
for (const r of narrow.results) {
  const ok = r.pageOverflow === 0;
  if (!ok) failed = true;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} /concepts/${r.slug} pageOverflow=${r.pageOverflow}px canvasOverflow=${r.canvasOverflow}px canvasW=${r.canvasWidth}`,
  );
}

console.log('\n=== Desktop (1280×900) — local Chrome CDP ===');
for (const r of desktop.results) {
  const ok = r.pageOverflow === 0;
  if (!ok) failed = true;
  console.log(`${ok ? 'PASS' : 'FAIL'} /concepts/${r.slug} pageOverflow=${r.pageOverflow}px`);
}

process.exit(failed ? 1 : 0);
