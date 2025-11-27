const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'tasks.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

app.use(cors());
app.use(express.json());

// Initialize data directory and files if they don't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    todo: [],
    inProgress: [],
    done: []
  }));
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
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

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Add user
app.post('/api/users', (req, res) => {
  try {
    const { username } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (!users.includes(username)) {
      users.push(username);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});