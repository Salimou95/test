import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Build du frontend généré par `npm run build -w web`
const webDist = path.join(__dirname, "../../web/dist");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Petit log des requêtes
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Liste toutes les tâches
app.get("/api/tasks", (_req, res) => {
  res.json(db.all());
});

// Crée une tâche
app.post("/api/tasks", (req, res) => {
  const title = (req.body?.title || "").trim();
  if (!title) {
    return res.status(400).json({ error: "Le titre est obligatoire" });
  }
  const task = db.create(title);
  res.status(201).json(task);
});

// Met à jour une tâche (titre et/ou statut)
app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = db.update(id, req.body ?? {});
  if (!task) {
    return res.status(404).json({ error: "Tâche introuvable" });
  }
  res.json(task);
});

// Supprime une tâche
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const ok = db.remove(id);
  if (!ok) {
    return res.status(404).json({ error: "Tâche introuvable" });
  }
  res.status(204).end();
});

// --- Frontend statique (production) ---
// Si le build existe (déploiement Railway), Express sert le frontend.
// En dev local, ce dossier n'existe pas : c'est Vite qui sert le front.
if (fs.existsSync(webDist)) {
  app.use(express.static(webDist));
  // Fallback : toute route non-API renvoie index.html
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(webDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
