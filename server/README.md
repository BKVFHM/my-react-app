# Backend for my-react-app

This small Express backend provides a simple API to store and move kanban-style tasks. It uses an in-memory store (not persisted) intended for local development.

Quick start

1. Open a terminal and change into the server folder:

```powershell
cd server
```

2. Install dependencies:

```powershell
npm install
```

3. Start in development mode (auto-restart):

```powershell
npm run dev
```

Or run without nodemon:

```powershell
npm start
```

Endpoints

- GET /api/ping — health check
- GET /api/tasks — returns the full tasks object { todo, inProgress, done }
- POST /api/tasks — add task, body { text, column? } (column defaults to "todo")
- DELETE /api/tasks — delete task, body { text, column }
- POST /api/tasks/move — move a task, body { text, from, to }
- POST /api/tasks/reset — clear all tasks

Notes

- Data is stored in-memory and will reset when the server restarts. For persistence, replace the in-memory store with a database (SQLite, MongoDB, etc.).
- The frontend will need to be updated to call these endpoints instead of using local state.
