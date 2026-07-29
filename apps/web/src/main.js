import { api } from "./api.js";

const listEl = document.getElementById("task-list");
const formEl = document.getElementById("new-task-form");
const inputEl = document.getElementById("new-task-input");
const statusEl = document.getElementById("status");

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function render(tasks) {
  listEl.innerHTML = "";
  if (tasks.length === 0) {
    setStatus("Aucune tâche. Ajoutez-en une !");
    return;
  }
  setStatus("");

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggle(task));

    const label = document.createElement("span");
    label.className = "title";
    label.textContent = task.title;

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "✕";
    del.title = "Supprimer";
    del.addEventListener("click", () => remove(task));

    li.append(checkbox, label, del);
    listEl.append(li);
  }
}

async function refresh() {
  try {
    render(await api.listTasks());
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function toggle(task) {
  try {
    await api.updateTask(task.id, { done: !task.done });
    await refresh();
  } catch (err) {
    setStatus(err.message, true);
  }
}

async function remove(task) {
  try {
    await api.deleteTask(task.id);
    await refresh();
  } catch (err) {
    setStatus(err.message, true);
  }
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return;
  try {
    await api.createTask(title);
    inputEl.value = "";
    await refresh();
  } catch (err) {
    setStatus(err.message, true);
  }
});

refresh();
