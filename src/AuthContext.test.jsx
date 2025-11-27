import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

// Test component to use the auth context
const TestComponent = () => {
  const { user, login, logout } = useAuth()
  return (
    <div>
      <div data-testid="user">{user ? user.username : 'No user'}</div>
      <button onClick={() => login('testuser')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  test('provides initial state with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId('user')).toHaveTextContent('No user')
  })

  test('login sets user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    fireEvent.click(screen.getByText('Login'))
    expect(screen.getByTestId('user')).toHaveTextContent('testuser')
  })

  test('logout clears user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    fireEvent.click(screen.getByText('Login'))
    fireEvent.click(screen.getByText('Logout'))
    expect(screen.getByTestId('user')).toHaveTextContent('No user')
  })
})