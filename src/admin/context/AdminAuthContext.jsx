import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import adminApi, { tokenStore } from '@/admin/api/client'

const AdminAuthContext = createContext(null)

const ALL_PERMISSIONS = [
  'manage-content',
  'manage-media',
  'manage-inbox',
  'manage-users',
  'manage-settings',
]

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [abilities, setAbilities] = useState([])
  const [status, setStatus] = useState(() => (tokenStore.get() ? 'loading' : 'guest'))

  const refresh = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null)
      setAbilities([])
      setStatus('guest')
      return null
    }

    try {
      const payload = await adminApi.me()
      setUser(payload.user)
      setAbilities(payload.abilities || [])
      setStatus('authenticated')
      return payload.user
    } catch {
      tokenStore.clear()
      setUser(null)
      setAbilities([])
      setStatus('guest')
      return null
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const onUnauthorized = () => {
      tokenStore.clear()
      setUser(null)
      setAbilities([])
      setStatus('guest')
    }
    window.addEventListener('admin:unauthorized', onUnauthorized)
    return () => window.removeEventListener('admin:unauthorized', onUnauthorized)
  }, [])

  const login = useCallback(async (email, password) => {
    const payload = await adminApi.login(email, password)
    setUser(payload.user)
    setAbilities(payload.abilities || [])
    setStatus('authenticated')
    return payload.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await adminApi.logout()
    } catch {
      // Clear locally even when the server call fails.
      tokenStore.clear()
    }
    setUser(null)
    setAbilities([])
    setStatus('guest')
  }, [])

  const value = useMemo(() => {
    const isAdmin = user?.role === 'admin' || abilities.includes('*')
    const permissions = isAdmin ? ALL_PERMISSIONS : abilities.filter((a) => ALL_PERMISSIONS.includes(a))
    return {
      user,
      abilities,
      permissions,
      status,
      isAdmin,
      isEditor: user?.role === 'editor',
      can: (permission) => isAdmin || permissions.includes(permission),
      login,
      logout,
      refresh,
    }
  }, [user, abilities, status, login, logout, refresh])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return context
}

export default AdminAuthContext
