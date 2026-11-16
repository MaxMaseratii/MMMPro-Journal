// Tiny JSON file store for values that must survive restarts (the Hotmail refresh token).
// On Railway, mount a volume and set DATA_DIR to its path (for example /data).
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.env.DATA_DIR || path.resolve('data');
const FILE = path.join(DIR, 'store.json');

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return {};
  }
}

export function get(key) {
  return readAll()[key];
}

export function set(key, value) {
  fs.mkdirSync(DIR, { recursive: true });
  const all = readAll();
  all[key] = value;
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(all), { mode: 0o600 });
  fs.renameSync(tmp, FILE);
}

export const dataDir = DIR;
