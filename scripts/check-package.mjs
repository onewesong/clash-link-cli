import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const directory = mkdtempSync(join(tmpdir(), 'clash-link-package-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
try {
  const metadata = JSON.parse(readFileSync('package.json', 'utf8'));
  const [archive] = JSON.parse(execFileSync(npm, ['pack', '--json', '--pack-destination', directory], { encoding: 'utf8' }));
  const files = archive.files.map(file => file.path);
  for (const required of ['bin/clash-link.mjs', 'dist/cli.js', 'dist/converter.js', 'LICENSE']) {
    assert(files.includes(required), `Missing package file: ${required}`);
  }
  assert(files.every(file => file === 'package.json' || file === 'LICENSE' || /^README/i.test(file) || /^(bin|dist)\//.test(file)), 'Unexpected package contents');
  const args = ['exec', '--yes', '--cache', join(directory, 'cache'), '--package', join(directory, archive.filename), '--', 'clash-link'];
  const run = (cliArgs, input) => execFileSync(npm, [...args, ...cliArgs], { cwd: directory, encoding: 'utf8', input });
  assert.equal(run(['--version']).trim(), metadata.version);
  assert.match(run(['--help']), /Usage: clash-link/);
  const output = run(['--format', 'json'], 'proxies:\n  - name: package-smoke\n    type: vless\n    server: example.com\n    port: 443\n    uuid: 00000000-0000-4000-8000-000000000000\n');
  const links = JSON.parse(output);
  assert.equal(links.length, 1);
  assert.equal(links[0].type, 'vless');
  assert.match(links[0].uri, /^vless:\/\//);
  console.log(`Verified ${metadata.name}@${metadata.version}: isolated npx execution, version, help and stdin conversion.`);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
