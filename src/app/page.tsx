"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Filter = "all" | "active" | "completed";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = "quiet-todo:tasks";

const starterTasks: Task[] = [
  { id: "starter-1", title: "Review the weekly priorities", completed: false },
  { id: "starter-2", title: "Book a haircut for next week", completed: false },
  { id: "starter-3", title: "Send the project update", completed: true },
];

function readSavedTasks(): Task[] {
  try {
    const savedTasks = window.localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return starterTasks;
    }

    const parsedTasks: unknown = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return starterTasks;
    }

    return parsedTasks.filter(
      (task): task is Task =>
        typeof task === "object" &&
        task !== null &&
        typeof (task as Task).id === "string" &&
        typeof (task as Task).title === "string" &&
        typeof (task as Task).completed === "boolean",
    );
  } catch {
    return starterTasks;
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setTasks(readSavedTasks());
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [isReady, tasks]);

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - activeCount;
  const visibleTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [filter, tasks]);

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTask.trim();

    if (!title) {
      return;
    }

    setTasks((currentTasks) => [
      { id: crypto.randomUUID(), title, completed: false },
      ...currentTasks,
    ]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  const filterLabels: Record<Filter, string> = {
    all: `All ${tasks.length}`,
    active: `Active ${activeCount}`,
    completed: `Completed ${completedCount}`,
  };

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header className="todo-header">
          <div>
            <p className="eyebrow">Daily focus</p>
            <h1 id="page-title">Your tasks</h1>
            <p className="task-summary">
              {activeCount === 0
                ? "Everything is clear for now."
                : `${activeCount} ${activeCount === 1 ? "task" : "tasks"} left to focus on.`}
            </p>
          </div>
          <div className="progress-mark" aria-label={`${completedCount} tasks completed`}>
            <span>{completedCount}</span>
            <span className="progress-label">done</span>
          </div>
        </header>

        <form className="task-form" onSubmit={handleAddTask}>
          <label className="sr-only" htmlFor="new-task">
            Add a task
          </label>
          <input
            id="new-task"
            type="text"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="What needs doing?"
            maxLength={120}
          />
          <button type="submit" className="add-button" disabled={!newTask.trim()}>
            Add task
          </button>
        </form>

        <nav className="filter-tabs" aria-label="Filter tasks">
          {(Object.keys(filterLabels) as Filter[]).map((filterName) => (
            <button
              key={filterName}
              type="button"
              className={filter === filterName ? "filter-tab is-active" : "filter-tab"}
              aria-pressed={filter === filterName}
              onClick={() => setFilter(filterName)}
            >
              {filterLabels[filterName]}
            </button>
          ))}
        </nav>

        <section className="task-list" aria-live="polite" aria-label="Task list">
          {visibleTasks.length > 0 ? (
            visibleTasks.map((task) => (
              <article className={task.completed ? "task-row is-complete" : "task-row"} key={task.id}>
                <button
                  type="button"
                  className="check-button"
                  aria-label={task.completed ? `Mark ${task.title} active` : `Complete ${task.title}`}
                  aria-pressed={task.completed}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed && <span aria-hidden="true">✓</span>}
                </button>
                <span className="task-title">{task.title}</span>
                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => deleteTask(task.id)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✦</span>
              <h2>{filter === "completed" ? "No completed tasks" : "A clear slate"}</h2>
              <p>
                {filter === "active"
                  ? "You have finished everything on your list."
                  : "Add something small to get started."}
              </p>
            </div>
          )}
        </section>

        <footer className="todo-footer">
          <span>{tasks.length === 0 ? "Ready when you are" : "Saved on this device"}</span>
          {completedCount > 0 && (
            <button type="button" className="clear-button" onClick={() => setTasks([])}>
              Clear all
            </button>
          )}
        </footer>
      </section>
      <p className="page-note">A little progress, every day.</p>
    </main>
  );
}
