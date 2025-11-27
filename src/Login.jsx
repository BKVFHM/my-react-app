import { useState } from 'react'
import { useAuth } from './AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      login(username.trim())
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '200px' }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
    </div>
  )
}

export default Login