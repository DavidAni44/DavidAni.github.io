// Fails if index.html references a local file that does not exist
// (stylesheets, scripts, images, fonts referenced from CSS, the resume PDF).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const missing = [];

function isLocal(ref) {
  return ref && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(ref);
}

function check(ref, from) {
  if (!isLocal(ref)) return;
  const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
  if (!clean) return;
  const path = clean.startsWith('/') ? join(root, clean) : join(dirname(from), clean);
  if (!existsSync(path)) missing.push(`${from.replace(`${root}/`, '')} -> ${ref}`);
}

const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');

for (const [, ref] of html.matchAll(/\b(?:src|href|poster)="([^"]*)"/g)) {
  check(ref, htmlPath);
}
for (const [, list] of html.matchAll(/\bsrcset="([^"]*)"/g)) {
  list.split(',').forEach((part) => check(part.trim().split(/\s+/)[0], htmlPath));
}
// Open Graph / Twitter images are absolute URLs on the live site; map them back to files.
for (const [, ref] of html.matchAll(/content="https:\/\/david-ani\.com\/(assets\/[^"]+)"/g)) {
  check(ref, htmlPath);
}

const cssPath = join(root, 'assets/css/style.css');
const css = readFileSync(cssPath, 'utf8');
for (const [, , ref] of css.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)) {
  check(ref, cssPath);
}

if (missing.length) {
  console.error('Missing referenced files:');
  missing.forEach((m) => console.error(`  ${m}`));
  process.exit(1);
}
console.log('All referenced local files exist.');
