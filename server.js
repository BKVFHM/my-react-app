const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    todo: [],
    inProgress: [],
    done: []
  }));
}

// Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

// Save all tasks
app.post('/api/tasks', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save tasks' });
  }
});

// Add new task
app.post('/api/tasks/add', (req, res) => {
  try {
    const { task } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.todo.push(task);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});