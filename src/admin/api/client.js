/**
 * Admin API client.
 *
 * All calls go through the real Laravel admin endpoints under /api/v1/admin.
 * The Sanctum token is stored in localStorage and attached to every request;
 * a 401 dispatches `admin:unauthorized` so the auth context can reset state.
 */

import axios from 'axios'
import { API_CONFIG } from '@/utils/constants'

const TOKEN_KEY = 'fikra-admin-token'

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      /* storage unavailable — session-only auth */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* no-op */
    }
  },
}

export class AdminApiError extends Error {
  constructor(message, { status = 0, errors = {} } = {}) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
    this.errors = errors
  }
}

const client = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: { Accept: 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const normalizeError = (error, path) => {
  const status = error.response?.status || 0
  const payload = error.response?.data || {}

  let message = payload.message
  if (!message || typeof message !== 'string') {
    if (status === 401) message = 'Invalid or expired session. Please sign in again.'
    else if (status === 403) message = 'You do not have permission to do that.'
    else if (status === 422) message = 'Please check the highlighted fields.'
    else if (status === 0) message = error.code === 'ECONNABORTED' ? 'The server took too long to respond.' : 'Cannot reach the API. Is the backend running?'
    else message = error.message || 'The request failed.'
  }

  const errors = payload.errors && typeof payload.errors === 'object' ? payload.errors : {}
  if (status === 401 && !String(path).includes('/auth/login')) {
    window.dispatchEvent(new CustomEvent('admin:unauthorized'))
  }

  return new AdminApiError(message, { status, errors })
}

client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error, error.config?.url)),
)

const unwrap = (response) => response.data?.data

export const adminApi = {
  // ---------------------------------------------------------------- auth
  login: async (email, password) => {
    const payload = unwrap(await client.post('/admin/auth/login', { email, password, device_name: 'admin-dashboard' }))
    tokenStore.set(payload.token)
    return payload
  },

  me: async () => unwrap(await client.get('/admin/auth/me')),

  logout: async () => {
    try {
      await client.post('/admin/auth/logout')
    } finally {
      tokenStore.clear()
    }
  },

  forgotPassword: async (email) => unwrap(await client.post('/admin/auth/forgot-password', { email })),

  // -------------------------------------------------------------- generic
  list: async (path, params = {}) => {
    const { data } = await client.get(path, { params })
    return {
      items: Array.isArray(data.data) ? data.data : [],
      pagination: data.meta?.pagination || null,
    }
  },

  get: async (path) => unwrap(await client.get(path)),

  create: async (path, payload) => unwrap(await client.post(path, payload)),

  update: async (path, payload) => unwrap(await client.patch(path, payload)),

  remove: async (path) => unwrap(await client.delete(path)),

  /** Multipart upload for media endpoints. */
  upload: async (path, files, collection) => {
    const form = new FormData()
    form.append('collection', collection)
    files.forEach((file) => form.append('files[]', file))
    const { data } = await client.post(path, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    return unwrap(data)
  },

  /** Authenticated CSV download via axios blob (a plain link cannot send the token). */
  download: async (path, filename, params = {}) => {
    const response = await client.get(path, { params, responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  },
}

export default adminApi
