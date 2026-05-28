const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = new Database('todos.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo TEXT NOT NULL,
    created_at TEXT
  )
`).run();

app.post('/agrega_todo', (req, res) => {
  const { todo } = req.body;

  if (!todo) {
    return res.status(400).json({
      error: 'El campo todo es obligatorio'
    });
  }

  const stmt = db.prepare(`
    INSERT INTO todos (todo, created_at)
    VALUES (?, datetime('now'))
  `);

  const result = stmt.run(todo);

  res.status(201).json({
    id: result.lastInsertRowid,
    todo
  });
});

app.get('/todos', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos').all();
  res.json(todos);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});