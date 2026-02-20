/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || 'src';

const forbidden = [
  /from\s+['"]\.\.\/domain\//,
  /from\s+['"]\.\/domain\//,
  /\.\.\/domain\//,
  /\.\/domain\//,
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) files.push(full);
  }
  return files;
}

const files = walk(root);
const hits = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const re of forbidden) {
    if (re.test(content)) {
      hits.push(`${file} matched ${re}`);
      break;
    }
  }
}

if (hits.length) {
  console.error('Found forbidden domain DTO imports:');
  for (const h of hits) console.error(` - ${h}`);
  process.exit(1);
}

console.log(`OK: no domain DTO imports found in ${root}`);

