import { useEffect, useMemo, useState } from "react";

const starterTasks = [
  {
    id: 1,
    title: "Book venue",
    category: "Venue",
    owner: "Both",
    dueDate: "2026-04-15",
    priority: "High",
    status: "In Progress",
    notes: "Narrow down top 3 options",
  },
  {
    id: 2,
    title: "Build guest list",
    category: "Guests",
    owner: "Nicole",
    dueDate: "2026-04-01",
    priority: "High",
    status: "Not Started",
    notes: "Start with immediate family",
  },
  {
    id: 3,
    title: "Research photographers",
    category: "Vendors",
    owner: "JP",
    dueDate: "2026-04-20",
    priority: "Medium",
    status: "Not Started",
    notes: "Looking for candid style",
  },
  {
    id: 4,
    title: "Draft music must-haves",
    category: "Reception",
    owner: "Both",
    dueDate: "2026-05-01",
    priority: "Low",
    status: "Complete",
    notes: "Start a shared playlist",
  },
];

const emptyForm = {
  title: "",
  category: "Venue",
  owner: "Both",
  dueDate: "",
  priority: "Medium",
  status: "Not Started",
  notes: "",
  vendor: "",
  estimatedCost: "",
  paidAmount: "",
};

const badgeClass = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-700",
  Complete: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Not Started": "bg-zinc-100 text-zinc-700",
};

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("wedding-planner-tasks");
    return saved ? JSON.parse(saved) : starterTasks;
  });

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("wedding-planner-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((task) => task.status === "Complete").length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const totalBudget = tasks.reduce(
    (sum, task) => sum + Number(task.estimatedCost || 0),
    0
  );
  const totalPaid = tasks.reduce(
    (sum, task) => sum + Number(task.paidAmount || 0),
    0
  );
  const totalRemaining = totalBudget - totalPaid;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const ownerMatch = ownerFilter === "All" || task.owner === ownerFilter;
      const statusMatch = statusFilter === "All" || task.status === statusFilter;
      return ownerMatch && statusMatch;
    });
  }, [tasks, ownerFilter, statusFilter]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    if (editingId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId
            ? {
                ...task,
                ...form,
                title: form.title.trim(),
              }
            : task
        )
      );
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...form,
        title: form.title.trim(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    setForm(emptyForm);
  }

  function startEdit(task) {
  setEditingId(task.id);
  setForm({
    title: task.title,
    category: task.category,
    owner: task.owner,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    notes: task.notes || "",
    vendor: task.vendor || "",
    estimatedCost: task.estimatedCost || "",
    paidAmount: task.paidAmount || "",
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "Complete" ? "Not Started" : "Complete",
            }
          : task
      )
    );
  }

  function deleteTask(id) {
    if (editingId === id) {
      cancelEdit();
    }
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            JP & Nicole Wedding Planner
          </p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Wedding Command Center</h1>
              <p className="mt-2 text-sm text-slate-600">
                Track checklist items, owners, deadlines, and notes in one place.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Progress</p>
            <p className="mt-2 text-3xl font-semibold">{percent}%</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Open Tasks</p>
            <p className="mt-2 text-3xl font-semibold">{tasks.length - completed}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-semibold">{completed}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Wedding Budget</p>
            <p className="mt-2 text-lg font-semibold">
              ${totalPaid.toLocaleString()} spent
            </p>
            <p className="text-sm text-slate-500">
              ${totalRemaining.toLocaleString()} remaining
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr,1.4fr]">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Task" : "Add Task"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update an existing wedding task."
                : "Add real checklist items for your wedding planning."}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Task Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Book florist"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option>Venue</option>
                    <option>Guests</option>
                    <option>Vendors</option>
                    <option>Reception</option>
                    <option>Ceremony</option>
                    <option>Decor</option>
                    <option>Attire</option>
                    <option>Budget</option>
                    <option>Food & Drink</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Owner</label>
                  <select
                    name="owner"
                    value={form.owner}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option>JP</option>
                    <option>Nicole</option>
                    <option>Both</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Complete</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any details, ideas, or reminders..."
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Vendor</label>
                <input
                  name="vendor"
                  value={form.vendor}
                  onChange={handleChange}
                  placeholder="Example: Smith Photography"
                  className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Estimated Cost</label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={form.estimatedCost}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Amount Paid</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={form.paidAmount}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                >
                  {editingId ? "Save Changes" : "Add Task"}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Checklist</h2>
                <p className="text-sm text-slate-500">
                  Filter tasks, edit them, and mark items complete.
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="All">All Owners</option>
                  <option value="JP">JP</option>
                  <option value="Nicole">Nicole</option>
                  <option value="Both">Both</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="All">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold">{task.title}</h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass[task.status]}`}
                        >
                          {task.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600">
                        {task.category} • {task.owner} • {task.dueDate || "No due date"}
                      </p>

                      {task.notes ? (
                        <p className="text-sm text-slate-500">{task.notes}</p>
                      ) : null}
                      {task.vendor && (
                        <p className="text-sm text-slate-500">
                          Vendor: {task.vendor}
                        </p>
                      )}

                      {task.estimatedCost && (
                        <div className="text-sm text-slate-500">
                          <p>Budget: ${task.estimatedCost}</p>
                          <p>Paid: ${task.paidAmount || 0}</p>
                          <p>
                            Remaining: $
                            {Math.max(Number(task.estimatedCost || 0) - Number(task.paidAmount || 0), 0)}
                          </p>
                        </div>
                      )}

                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="rounded-2xl border border-slate-300 px-3 py-2 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className="rounded-2xl border border-slate-300 px-3 py-2 text-sm font-medium"
                      >
                        {task.status === "Complete" ? "Undo" : "Complete"}
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="rounded-2xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  No tasks match your filters yet.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}