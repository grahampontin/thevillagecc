/* eslint-disable no-console */
const fs = require('fs');
const path = process.argv[2];

if (!path) {
  console.error('Usage: node scripts/strip-bom.js <file>');
  process.exit(2);
}

const buf = fs.readFileSync(path);

// UTF-8 BOM: EF BB BF
if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  fs.writeFileSync(path, buf.slice(3));
  console.log(`Stripped UTF-8 BOM from ${path}`);
} else {
  console.log(`No BOM found in ${path}`);
}

