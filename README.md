# Monorepo Demo

Petit monorepo d'exemple : un **frontend** et un **faux backend** (données en mémoire, aucune vraie base de données).

## Structure

```
.
├── package.json          # racine — npm workspaces + scripts
└── apps/
    ├── server/           # faux backend Express (API REST, données en mémoire)
    │   └── src/
    │       ├── index.js  # routes /api/tasks
    │       └── db.js     # "BDD" = un tableau JS
    └── web/              # frontend Vite (vanilla JS)
        ├── index.html
        └── src/
            ├── main.js
            ├── api.js
            └── style.css
```

## Installation

```bash
npm install
```

(Une seule commande installe les deux workspaces.)

## Démarrer en développement

```bash
npm run dev
```

Lance **en parallèle** :
- le backend sur http://localhost:3001
- le frontend sur http://localhost:5173

Ouvrez http://localhost:5173. Le frontend proxifie `/api` vers le backend.

Pour lancer séparément : `npm run dev:server` ou `npm run dev:web`.

## API du faux backend

| Méthode | Route             | Description             |
| ------- | ----------------- | ----------------------- |
| GET     | `/api/health`     | État du serveur         |
| GET     | `/api/tasks`      | Liste les tâches        |
| POST    | `/api/tasks`      | Crée une tâche          |
| PATCH   | `/api/tasks/:id`  | Modifie une tâche       |
| DELETE  | `/api/tasks/:id`  | Supprime une tâche      |

> ⚠️ Les données vivent en mémoire : elles sont réinitialisées à chaque
> redémarrage du serveur.

## Build de production (frontend)

```bash
npm run build      # génère apps/web/dist
npm start          # démarre le backend seul
```
