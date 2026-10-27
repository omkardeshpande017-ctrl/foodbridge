import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())

  useEffect(() => {
    // keep in sync if another tab logs out/in
    const onStorage = () => setUser(authService.getSession())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = (credentials) => {
    const loggedIn = authService.login(credentials)
    setUser(loggedIn)
    return loggedIn
  }

  const register = (payload) => {
    const registered = authService.register(payload)
    setUser(registered)
    return registered
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
