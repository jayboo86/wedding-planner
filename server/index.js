const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const task = req.body;

  const stmt = db.prepare(`
    INSERT INTO tasks
    (title, category, owner, due_date, priority, status, notes, vendor, estimated_cost, paid_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    task.title,
    task.category,
    task.owner,
    task.dueDate,
    task.priority,
    task.status,
    task.notes,
    task.vendor,
    task.estimatedCost,
    task.paidAmount
  );

  res.json({ id: result.lastInsertRowid });
});

app.listen(PORT, () => {
  console.log("Wedding Planner API running on port 4000");
});