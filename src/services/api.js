/**
 * API layer with axios.
 *
 * The UI reads content through `@/hooks/useContent`, which seeds from the
 * bundled mock data and refreshes from this client. Point `VITE_API_URL` at
 * the Laravel API (`/api/v1` behind the dev proxy, or an absolute URL) and
 * set `VITE_USE_MOCK=false` to use live data. Keeping `VITE_USE_MOCK=true`
 * serves the mock responses with a simulated delay.
 */

import axios from 'axios'
import { API_CONFIG, API_ENDPOINTS } from '@/utils/constants'
import { delay } from '@/utils/helpers'
import * as mockData from '@/data/mock'

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for unified error handling (rejected promise carries
// the message; callers decide how to surface it — no console noise here)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'فشل الاتصال بالخادم'
    return Promise.reject(new Error(message))
  }
)

/**
 * Mock data store (simulates REST API responses), populated from src/data/mock
 */
const MOCK_DB = {
  services: mockData.services || [],
  solutions: mockData.solutions || [],
  projects: mockData.projects || [],
  team: mockData.team || [],
  testimonials: mockData.testimonials || [],
  posts: (mockData.posts || []).filter((p) => p.published !== false),
  faqs: mockData.faqs || [],
  pricing: mockData.pricing || [],
  stats: mockData.stats || [],
}

/**
 * Multilingual fields are `{ en, fr, ar }` objects — flatten for search.
 */
const textOf = (value, lang = 'en') => {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') return value[lang] ?? value.en ?? ''
  return String(value)
}

/**
 * Generic mock request helper (simulates network delay + pagination)
 */
async function mockRequest(items, endpoint, { page = 1, limit = null } = {}) {
  const all = Array.isArray(items) ? items : MOCK_DB[endpoint] || []

  if (!all.length) {
    return { data: [], meta: { total: 0, page: 1, pageSize: limit || 12 } }
  }

  if (API_CONFIG.useMock) {
    await delay(400 + Math.random() * 400)
  }

  const pageSize = limit || all.length
  const start = (page - 1) * pageSize
  const data = limit ? all.slice(start, start + pageSize) : all

  return {
    data,
    meta: { total: all.length, page, pageSize },
  }
}

// ============================================================
// REAL API FUNCTIONS — replace these when backend is ready
// ============================================================

export async function getServices() {
  if (API_CONFIG.useMock) {
    return mockRequest(null, 'services')
  }
  const res = await api.get(API_ENDPOINTS.services)
  return res.data
}

export async function getServiceBySlug(slug) {
  const res = await getServices()
  return res.data.find((s) => s.slug === slug) || null
}

export async function getSolutions({ category = null, search = '', page = 1, limit = 12 } = {}) {
  if (API_CONFIG.useMock) {
    let items = MOCK_DB.solutions

    if (category && category !== 'all') {
      items = items.filter((s) => s.category === category)
    }

    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (s) =>
          textOf(s.name).toLowerCase().includes(q) ||
          textOf(s.description).toLowerCase().includes(q)
      )
    }

    return mockRequest(items, 'solutions', { page, limit })
  }
  const params = { page, limit, ...(category && category !== 'all' ? { category } : {}), ...(search ? { search } : {}) }
  const res = await api.get(API_ENDPOINTS.solutions, { params })
  return res.data
}

export async function getSolutionBySlug(slug) {
  const res = await getSolutions({ limit: null })
  return res.data.find((s) => s.slug === slug) || null
}

export async function getProjects({ category = null, search = '', page = 1, limit = 12 } = {}) {
  if (API_CONFIG.useMock) {
    let items = MOCK_DB.projects

    if (category && category !== 'all') {
      items = items.filter((p) => p.category === category)
    }

    if (search) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          textOf(p.title).toLowerCase().includes(q) ||
          textOf(p.description).toLowerCase().includes(q) ||
          (p.client || '').toLowerCase().includes(q)
      )
    }

    return mockRequest(items, 'projects', { page, limit })
  }
  const params = { page, limit, ...(category && category !== 'all' ? { category } : {}), ...(search ? { search } : {}) }
  const res = await api.get(API_ENDPOINTS.projects, { params })
  return res.data
}

export async function getProjectBySlug(slug) {
  const res = await getProjects({ limit: null })
  return res.data.find((p) => p.slug === slug) || null
}

export async function getTeam() {
  if (API_CONFIG.useMock) {
    return mockRequest(null, 'team')
  }
  const res = await api.get(API_ENDPOINTS.team)
  return res.data
}

export async function getTestimonials({ limit = 6 } = {}) {
  if (API_CONFIG.useMock) {
    const items = MOCK_DB.testimonials
    return { data: limit ? items.slice(0, limit) : items }
  }
  const params = limit ? { limit } : {}
  const res = await api.get(API_ENDPOINTS.testimonials, { params })
  return res.data
}

export async function getPosts({ category = null, page = 1, limit = 12 } = {}) {
  if (API_CONFIG.useMock) {
    let items = MOCK_DB.posts
    if (category && category !== 'all') {
      items = items.filter((p) => textOf(p.category) === category)
    }
    return mockRequest(items, 'posts', { page, limit })
  }
  const params = { page, limit, ...(category && category !== 'all' ? { category } : {}) }
  const res = await api.get(API_ENDPOINTS.posts, { params })
  return res.data
}

export async function getPostBySlug(slug) {
  const res = await getPosts({ limit: null })
  return res.data.find((p) => p.slug === slug) || null
}

export async function getFAQs() {
  if (API_CONFIG.useMock) {
    return mockRequest(null, 'faqs')
  }
  const res = await api.get(API_ENDPOINTS.faqs)
  return res.data
}

export async function getPricing() {
  if (API_CONFIG.useMock) {
    return mockRequest(null, 'pricing')
  }
  const res = await api.get(API_ENDPOINTS.pricing)
  return res.data
}

export async function getStats() {
  if (API_CONFIG.useMock) {
    return mockRequest(null, 'stats')
  }
  const res = await api.get(API_ENDPOINTS.stats)
  return res.data
}

/**
 * Contact / quote form submission.
 *
 * `data` is the multi-step form state; `files` holds File objects. When
 * attachments are present the payload is sent as multipart/form-data so the
 * API can store them on its private disk.
 */
export async function sendQuote(data) {
  if (API_CONFIG.useMock) {
    await delay(800 + Math.random() * 700)
    return { success: true, message: 'تم إرسال رسالتك بنجاح' }
  }

  const { files, ...fields } = data || {}
  const hasFiles = Array.isArray(files) && files.length > 0

  if (hasFiles) {
    const form = new FormData()
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') form.append(key, value)
    })
    files.forEach((file) => form.append('files[]', file))

    const res = await api.post(API_ENDPOINTS.contact, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  }

  const res = await api.post(API_ENDPOINTS.contact, fields)
  return res.data
}

/**
 * "Request this solution" form on the solution detail page.
 */
export async function sendSolutionRequest(slug, data) {
  if (API_CONFIG.useMock) {
    await delay(800 + Math.random() * 700)
    return { success: true }
  }

  const res = await api.post(`${API_ENDPOINTS.solutions}/${encodeURIComponent(slug)}/request`, data)
  return res.data
}

/**
 * Admin password reset (link sent by POST /admin/auth/forgot-password).
 */
export async function resetPassword(payload) {
  if (API_CONFIG.useMock) {
    await delay(800 + Math.random() * 700)
    return { success: true }
  }

  const res = await api.post('/admin/auth/reset-password', payload)
  return res.data
}

export default api
