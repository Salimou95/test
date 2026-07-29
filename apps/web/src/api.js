// Petit client HTTP vers le faux backend.
// Grâce au proxy Vite, on appelle simplement /api/...

const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erreur HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  listTasks: () => request("/tasks"),
  createTask: (title) =>
    request("/tasks", { method: "POST", body: JSON.stringify({ title }) }),
  updateTask: (id, patch) =>
    request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
