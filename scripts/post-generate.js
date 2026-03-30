/**
 * Post-generate hook: remove Node 'url' import lines from OpenAPI-generated files.
 * (URL/URLSearchParams are globals in browser/Next.js; the import is unnecessary and can trigger lint/TS issues.)
 */
const fs = require('fs');
const path = require('path');

const generatedDir = path.join(__dirname, '..', 'src', 'generated');

const urlImportRe = /^\s*import\s*\{\s*URL\s*,\s*URLSearchParams\s*\}\s*from\s*['"]url['"]\s*;?\s*$/;

function stripUrlImportLines(filePath, patterns) {
  const fullPath = path.join(generatedDir, filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const filtered = lines.filter((line) => {
    return !patterns.some((p) => (typeof p === 'function' ? p(line) : p.test(line)));
  });
  fs.writeFileSync(fullPath, filtered.join('\n'), 'utf8');
  console.log('Post-generate: stripped url import lines from', filePath);
}

function stripUrlImportBlock(filePath, shouldDrop) {
  const fullPath = path.join(generatedDir, filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  const filtered = lines.filter((line, i) => !shouldDrop(line, i, lines));
  fs.writeFileSync(fullPath, filtered.join('\n'), 'utf8');
  console.log('Post-generate: stripped url import block from', filePath);
}

// api.ts: remove whole url import block (comment, @ts-ignore, import, "Some imports not used")
stripUrlImportBlock('api.ts', (line, i, lines) => {
  if (/^\s*\/\/\s*URLSearchParams not necessarily used\s*$/.test(line)) return true;
  if (/^\s*import\s*\{\s*URL\s*,\s*URLSearchParams\s*\}\s*from\s*['"]url['"]\s*;?\s*$/.test(line)) return true;
  if (/^\s*\/\/\s*Some imports not used depending on template conditions\s*$/.test(line)) return true;
  // remove @ts-ignore only when it immediately precedes the url import
  if (/^\s*\/\/\s*@ts-ignore\s*$/.test(line) && lines[i + 1] && urlImportRe.test(lines[i + 1])) return true;
  return false;
});

// common.ts: remove url import line only
stripUrlImportLines('common.ts', [(line) => urlImportRe.test(line)]);
