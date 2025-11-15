const fs = require('fs');
const path = require('path');

const proxyPath = path.resolve(__dirname, '..', 'proxy.conf.json');
const outPath = path.resolve(__dirname, '..', 'src', 'assets', 'api-config.json');

try {
  const proxyRaw = fs.readFileSync(proxyPath, 'utf8');
  const proxy = JSON.parse(proxyRaw);

  // Find the first entry with a 'target' string
  const entries = Object.entries(proxy);
  let target = '';
  for (const [key, value] of entries) {
    if (value && value.target) {
      target = value.target;
      break;
    }
  }

  const out = { apiBase: target || '' };
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote api-config.json with apiBase=${out.apiBase}`);
} catch (err) {
  console.error('Failed to sync proxy.conf.json -> src/assets/api-config.json', err);
  process.exitCode = 1;
}
