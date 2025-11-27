import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import { AuthProvider } from './AuthContext'

// Mock fetch
global.fetch = jest.fn()

const mockUser = { username: 'testuser' }

jest.mock('./AuthContext', () => ({
  ...jest.requireActual('./AuthContext'),
  useAuth: () => ({
    user: mockUser,
    logout: jest.fn()
  })
}))

describe('App', () => {
  beforeEach(() => {
    fetch.mockClear()
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ todo: [], inProgress: [], done: [] })
    })
  })

  test('renders welcome message for logged in user', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument()
    })
  })

  test('renders kanban columns', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('To Be Done')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      expect(screen.getByText('Done')).toBeInTheDocument()
    })
  })

  test('adds task when form is submitted', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Enter Task Name')
      const button = screen.getByText('Add Task')
      
      fireEvent.change(input, { target: { value: 'Test task' } })
      fireEvent.click(button)
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Test task (testuser)')
      })
    })
  })

  test('fetches data on mount', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/tasks')
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/users')
    })
  })
})