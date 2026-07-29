// Fausse "base de données" : simple tableau en mémoire.
// Les données sont réinitialisées à chaque redémarrage du serveur.

let nextId = 4;

const tasks = [
  { id: 1, title: "Configurer le monorepo", done: true },
  { id: 2, title: "Créer le faux backend", done: true },
  { id: 3, title: "Brancher le frontend sur l'API", done: false },
];

export const db = {
  all() {
    return tasks;
  },

  find(id) {
    return tasks.find((t) => t.id === id);
  },

  create(title) {
    const task = { id: nextId++, title, done: false };
    tasks.push(task);
    return task;
  },

  update(id, patch) {
    const task = this.find(id);
    if (!task) return null;
    if (typeof patch.title === "string") task.title = patch.title;
    if (typeof patch.done === "boolean") task.done = patch.done;
    return task;
  },

  remove(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};
