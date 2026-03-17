const express = require("express");
const cors = require("cors");
const db = require("./db");
const auth = require('./auth');

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://wedding-planner-gamma.vercel.app"],
  })
);

app.use(express.json());

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category || "",
    owner: row.owner || "",
    dueDate: row.due_date || "",
    priority: row.priority || "Medium",
    status: row.status || "Not Started",
    notes: row.notes || "",
    vendor: row.vendor || "",
    estimatedCost: row.estimated_cost ?? 0,
    paidAmount: row.paid_amount ?? 0,
    createdAt: row.created_at,
  };
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/tasks", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM tasks ORDER BY datetime(created_at) DESC, id DESC")
    .all();

  res.json(rows.map(mapTask));
});

app.post("/api/tasks", (req, res) => {
  const {
    title,
    category = "",
    owner = "",
    dueDate = "",
    priority = "Medium",
    status = "Not Started",
    notes = "",
    vendor = "",
    estimatedCost = 0,
    paidAmount = 0,
  } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const result = db
    .prepare(`
      INSERT INTO tasks (
        title, category, owner, due_date, priority, status, notes,
        vendor, estimated_cost, paid_amount
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      String(title).trim(),
      category,
      owner,
      dueDate,
      priority,
      status,
      notes,
      vendor,
      Number(estimatedCost || 0),
      Number(paidAmount || 0)
    );

  const row = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(mapTask(row));
});

app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  const {
    title,
    category = "",
    owner = "",
    dueDate = "",
    priority = "Medium",
    status = "Not Started",
    notes = "",
    vendor = "",
    estimatedCost = 0,
    paidAmount = 0,
  } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  db.prepare(`
    UPDATE tasks
    SET
      title = ?,
      category = ?,
      owner = ?,
      due_date = ?,
      priority = ?,
      status = ?,
      notes = ?,
      vendor = ?,
      estimated_cost = ?,
      paid_amount = ?
    WHERE id = ?
  `).run(
    String(title).trim(),
    category,
    owner,
    dueDate,
    priority,
    status,
    notes,
    vendor,
    Number(estimatedCost || 0),
    Number(paidAmount || 0),
    id
  );

  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  res.json(mapTask(updated));
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
});

// --- AUTH ROUTES ---
app.post('/api/login', (req, res) => {
  console.log('LOGIN BODY:', req.body); // Debug log
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (!auth.authenticateUser(username, password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = auth.generateToken(username);
  res.json({ token });
});

// Example protected route
app.get('/api/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  const payload = auth.verifyToken(token);
  if (!payload) return res.status(403).json({ error: 'Invalid token' });
  res.json({ message: `Hello, ${payload.username}` });
});

app.listen(PORT, () => {
  console.log(`Wedding Planner API running on port ${PORT}`);
});