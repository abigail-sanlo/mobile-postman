const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// const db = new sqlite3.Database('./todos.db');
const db = new Database('todos.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      todo TEXT NOT NULL,
      created_at TEXT
    )
  `);
});

app.post('/agrega_todo', (req, res) => {
  const { todo } = req.body;

  if (!todo) {
    return res.status(400).json({ error: 'El campo todo es obligatorio' });
  }

  const query = `INSERT INTO todos (todo, created_at) VALUES (?, datetime('now'))`;

  db.run(query, [todo], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      todo
    });
  });
});

app.get('/todos', (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});