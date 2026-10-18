import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(here, 'data');
const SEED_FILE = path.join(DATA_DIR, 'seed.json');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export function hashPassword(plain) {
  return crypto.createHash('md5').update(plain).digest('hex');
}

function buildFromSeed() {
  const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
  seed.users = seed.users.map((u) => {
    const { password, ...rest } = u;
    return { ...rest, passwordHash: hashPassword(password) };
  });
  return seed;
}

function load() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
      // corrupted working copy, fall through to a fresh build
    }
  }
  const fresh = buildFromSeed();
  fs.writeFileSync(DB_FILE, JSON.stringify(fresh, null, 2));
  return fresh;
}

export const db = load();

let pending = null;

/**
 * Debounced write-through to disk. Callers await this so the response is only
 * sent once the mutation is durable.
 */
export function persist() {
  if (pending) return pending;
  pending = new Promise((resolve) => {
    setTimeout(() => {
      fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), () => {
        pending = null;
        resolve();
      });
    }, 25);
  });
  return pending;
}

export function nextId(collection) {
  return collection.reduce((max, row) => (row.id > max ? row.id : max), 0) + 1;
}

export function resetDb() {
  if (fs.existsSync(DB_FILE)) fs.rmSync(DB_FILE);
  const fresh = buildFromSeed();
  fs.writeFileSync(DB_FILE, JSON.stringify(fresh, null, 2));
  return fresh;
}
