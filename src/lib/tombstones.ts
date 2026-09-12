import fs from "fs";
import path from "path";

const TOMBSTONES_FILE = path.join(process.cwd(), "data", "tombstones.json");

export function getTombstoneSet(): Set<string> {
  try {
    if (fs.existsSync(TOMBSTONES_FILE)) {
      const raw = fs.readFileSync(TOMBSTONES_FILE, "utf8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return new Set(list);
      }
    }
  } catch (err) {
    console.error("Error reading tombstones file:", err);
  }
  return new Set();
}

export function addTombstone(id: string) {
  try {
    const dir = path.dirname(TOMBSTONES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const set = getTombstoneSet();
    set.add(id);
    fs.writeFileSync(TOMBSTONES_FILE, JSON.stringify(Array.from(set), null, 2), "utf8");
  } catch (err) {
    console.error("Error saving tombstone:", err);
  }
}

export function removeTombstone(id: string) {
  try {
    const set = getTombstoneSet();
    if (set.has(id)) {
      set.delete(id);
      fs.writeFileSync(TOMBSTONES_FILE, JSON.stringify(Array.from(set), null, 2), "utf8");
    }
  } catch (err) {
    console.error("Error removing tombstone:", err);
  }
}
