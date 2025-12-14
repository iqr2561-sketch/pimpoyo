// Sistema de autenticación simple para desarrollo

const AUTH_KEY = 'app-auth'

// Credenciales de acceso rápido - pueden ser configuradas via variables de entorno
const getCredentials = () => {
  if (typeof window !== 'undefined') {
    // En el cliente, usar variables de entorno o valores por defecto
    return {
      username: process.env.NEXT_PUBLIC_AUTH_USERNAME || 'admin',
      password: process.env.NEXT_PUBLIC_AUTH_PASSWORD || '1234',
    }
  }
  // En el servidor durante el build, usar valores por defecto
  return {
    username: 'admin',
    password: '1234',
  }
}

const DEV_CREDENTIALS = getCredentials()

export interface AuthUser {
  username: string
  isAuthenticated: boolean
}

export function login(username: string, password: string): boolean {
  if (username === DEV_CREDENTIALS.username && password === DEV_CREDENTIALS.password) {
    const user: AuthUser = {
      username,
      isAuthenticated: true,
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(AUTH_KEY)
  return stored ? JSON.parse(stored) : null
}

export function isAuthenticated(): boolean {
  const user = getCurrentUser()
  return user?.isAuthenticated === true
}
