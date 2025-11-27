import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import Login from './Login'
import './App.css'

function App() {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  })
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/tasks')
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error('Failed to load tasks:', err))
      
      fetch('http://localhost:5000/api/users')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error('Failed to load users:', err))
      
      // Add current user to users list
      fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username })
      })
    }
  }, [user])

  const saveTasks = (newTasks) => {
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTasks)
    })
  }
  const [task, setTask] = useState('')
  const [draggedTask, setDraggedTask] = useState(null)
  const [draggedFrom, setDraggedFrom] = useState(null)


  function selectInput(event){
    setTask(event.target.value);
    
    
      
  }
  function addTask(){
    if (task.trim()) {
      const assignedUser = selectedUser || user.username
      const taskWithUser = `${task} (${assignedUser})`
      const newTasks = {...tasks, todo: [...tasks.todo, taskWithUser]}
      setTasks(newTasks)
      saveTasks(newTasks)
      setTask('')
      setSelectedUser('')
      document.getElementById("submit").value = ""
    }
  }

  function deleteTask(taskText, column){
    const newTasks = {...tasks, [column]: tasks[column].filter(t => t !== taskText)}
    setTasks(newTasks)
    saveTasks(newTasks)
  }

  function dragStart(e, taskText, column){
    setDraggedTask(taskText)
    setDraggedFrom(column)
  }
 
  function dragOver(e){
    e.preventDefault()
  }

  function drop(e, targetColumn){
    e.preventDefault()
    if (draggedTask && draggedFrom !== targetColumn) {
      const newTasks = {
        ...tasks,
        [draggedFrom]: tasks[draggedFrom].filter(t => t !== draggedTask),
        [targetColumn]: [...tasks[targetColumn], draggedTask]
      }
      setTasks(newTasks)
      saveTasks(newTasks)
    }
    setDraggedTask(null)
    setDraggedFrom(null)
  }





  if (!user) {
    return <Login />
  }

  return(
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
        <h2>Welcome, {user.username}!</h2>
        <button onClick={logout} style={{ padding: '5px 10px' }}>Logout</button>
      </div>
      <div className="row">
        <div className="column" onDragOver={dragOver} onDrop={(e) => drop(e, 'todo')}>
          <h1>To Be Done</h1>
          {tasks.todo.map((taskText, index) => (
            <div key={index}  className="task-item" draggable onDragStart={(e) => dragStart(e, taskText, 'todo')}>
              <span onDoubleClick={() => deleteTask(taskText, 'todo')}>{taskText}</span> 
            </div>
          ))}
        </div>

        <div className="column" onDragOver={dragOver} onDrop={(e) => drop(e, 'inProgress')}>
          <h1>In Progress</h1>
          {tasks.inProgress.map((taskText, index) => (
            <div key={index} className="task-item" draggable onDragStart={(e) => dragStart(e, taskText, 'inProgress')}>
              <span onDoubleClick={() => deleteTask(taskText, 'inProgress')}>{taskText}</span>  
            </div>
          ))}
        </div>

        <div className="column" onDragOver={dragOver} onDrop={(e) => drop(e, 'done')}>
          <h1>Done</h1>
          {tasks.done.map((taskText, index) => (
            <div key={index} className="task-item" draggable onDragStart={(e) => dragStart(e, taskText, 'done')}>
              <span onDoubleClick={() => deleteTask(taskText, 'done')}>{taskText}</span> 
            </div>
          ))}
        </div>
      </div>

      <div className="activity">
        <input id="submit" onChange={selectInput} type="text" placeholder='Enter Task Name' />
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} style={{ margin: '0 10px', padding: '5px' }}>
          <option value="">Assign to me</option>
          {users.filter(u => u !== user.username).map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <button className ="add-kanban-button" onClick={addTask}>Add Task</button>
        </div>
      
        
      
      
    </div>

    

  )
}

  

export default App
