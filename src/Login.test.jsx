import { render, screen, fireEvent } from '@testing-library/react'
import Login from './Login'
import { AuthProvider } from './AuthContext'

const mockLogin = jest.fn()

jest.mock('./AuthContext', () => ({
  ...jest.requireActual('./AuthContext'),
  useAuth: () => ({ login: mockLogin })
}))

describe('Login', () => {
  beforeEach(() => {
    mockLogin.mockClear()
  })

  test('renders login form', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  test('calls login with username on form submit', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
    
    const input = screen.getByPlaceholderText('Enter username')
    const button = screen.getByText('Login')
    
    fireEvent.change(input, { target: { value: 'testuser' } })
    fireEvent.click(button)
    
    expect(mockLogin).toHaveBeenCalledWith('testuser')
  })

  test('does not call login with empty username', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
    
    fireEvent.click(screen.getByText('Login'))
    expect(mockLogin).not.toHaveBeenCalled()
  })
})