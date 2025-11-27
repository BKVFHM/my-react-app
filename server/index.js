import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Simple in-memory store matching the frontend shape
let tasks = {
  todo: [
    // sample data
  ],
  inProgress: [],
  done: []
}

// Helpers
function safeColumn(column){
  return ['todo','inProgress','done'].includes(column)
}

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: Date.now() })
})

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks)
})

// Add a task: { text, column }
app.post('/api/tasks', (req, res) => {
  const { text, column } = req.body
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "text" in body' })
  }
  const dest = column || 'todo'
  if (!safeColumn(dest)) return res.status(400).json({ error: 'Invalid column' })
  tasks[dest].push(text)
  res.status(201).json({ ok: true, tasks })
})

// Delete a task: { text, column }
app.delete('/api/tasks', (req, res) => {
  const { text, column } = req.body
  if (!text || typeof text !== 'string' || !safeColumn(column)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }
  tasks[column] = tasks[column].filter(t => t !== text)
  res.json({ ok: true, tasks })
})

// Move a task: { text, from, to }
app.post('/api/tasks/move', (req, res) => {
  const { text, from, to } = req.body
  if (!text || !safeColumn(from) || !safeColumn(to)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }
  // remove from source
  tasks[from] = tasks[from].filter(t => t !== text)
  // add to destination
  tasks[to].push(text)
  res.json({ ok: true, tasks })
})

// Reset (for development)
app.post('/api/tasks/reset', (req, res) => {
  tasks = { todo: [], inProgress: [], done: [] }
  res.json({ ok: true, tasks })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
