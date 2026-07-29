import express from "express";
import cors from "cors";
import { db } from "./db.js";

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

app.listen(PORT, () => {
  console.log(`✅ Faux backend démarré sur http://localhost:${PORT}`);
});
