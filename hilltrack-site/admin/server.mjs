// Local-only admin server. Run on your laptop with `npm run admin`.
// Opens http://localhost:5174 — edit content, then `git push` to publish.

import express from "express";
import multer from "multer";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "public", "data");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");
await fs.mkdir(DATA_DIR, { recursive: true });
await fs.mkdir(UPLOAD_DIR, { recursive: true });

const SETTINGS_DEFAULTS = {
  about: "",
  aims: [],
  contact_phone: "", contact_email: "", contact_address: "",
  bank_details: "", upi_id: "",
  homepage_stats: [],
  donation_tiers: [],
};

async function readJSON(name, fallback) {
  try { return JSON.parse(await fs.readFile(path.join(DATA_DIR, `${name}.json`), "utf8")); }
  catch { return fallback; }
}
async function writeJSON(name, value) {
  await fs.writeFile(path.join(DATA_DIR, `${name}.json`), JSON.stringify(value, null, 2));
}

const COLLECTIONS = ["members", "events", "initiatives", "achievements", "schools", "gallery"];

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use("/admin", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(UPLOAD_DIR));

// --- Collections: GET / POST / PUT / DELETE ---
COLLECTIONS.forEach((col) => {
  app.get(`/api/${col}`, async (_, res) => res.json(await readJSON(col, [])));

  app.post(`/api/${col}`, async (req, res) => {
    const list = await readJSON(col, []);
    const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...req.body };
    list.push(item);
    await writeJSON(col, list);
    res.json(item);
  });

  app.put(`/api/${col}/:id`, async (req, res) => {
    const list = await readJSON(col, []);
    const idx = list.findIndex((x) => x.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "not found" });
    list[idx] = { ...list[idx], ...req.body, id: list[idx].id };
    await writeJSON(col, list);
    res.json(list[idx]);
  });

  app.delete(`/api/${col}/:id`, async (req, res) => {
    const list = await readJSON(col, []);
    const next = list.filter((x) => x.id !== req.params.id);
    await writeJSON(col, next);
    res.json({ ok: true });
  });
});

// --- Settings (single object) ---
app.get("/api/settings", async (_, res) => res.json(await readJSON("settings", SETTINGS_DEFAULTS)));
app.put("/api/settings", async (req, res) => {
  const cur = await readJSON("settings", SETTINGS_DEFAULTS);
  const next = { ...cur, ...req.body };
  await writeJSON("settings", next);
  res.json(next);
});

// --- Image upload ---
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".bin";
    cb(null, `${crypto.randomBytes(8).toString("hex")}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "no file" });
  res.json({ url: `uploads/${req.file.filename}` });
});

// --- Firebase config (read-only, for admin panel to bootstrap Firebase) ---
app.get("/api/firebase-config", async (_, res) => {
  try {
    const src = await fs.readFile(path.join(ROOT, "src", "lib", "firebase.js"), "utf8");
    const match = src.match(/const firebaseConfig\s*=\s*(\{[\s\S]*?\});/);
    if (!match) return res.json(null);
    // eslint-disable-next-line no-eval
    const cfg = eval(`(${match[1]})`);
    res.json(cfg);
  } catch {
    res.json(null);
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`\n  ✓ Hilltrack Admin running at  http://localhost:${PORT}/admin/\n`);
  console.log(`    All changes are written to  public/data/*.json  and  public/uploads/`);
  console.log(`    When you're done, commit and push to GitHub to publish.\n`);
});
