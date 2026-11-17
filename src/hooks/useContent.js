import { useEffect, useState } from 'react'
import * as mock from '@/data/mock'
import {
  getFAQs,
  getPosts,
  getPricing,
  getProjects,
  getServices,
  getSolutions,
  getStats,
  getTeam,
  getTestimonials,
} from '@/services/api'

/**
 * Content hooks.
 *
 * Each hook renders immediately from the bundled mock data, then refreshes
 * from the Laravel API when it is reachable. If the request fails (backend
 * down, offline preview, bad deploy) the mock copy stays on screen, so the
 * site degrades gracefully instead of showing an empty page.
 */

const listOf = (result) => {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.data)) return result.data
  return null
}

function useContent(initial, load) {
  const [items, setItems] = useState(initial)

  useEffect(() => {
    let active = true

    load()
      .then((result) => {
        const next = listOf(result)
        if (active && next && next.length > 0) setItems(next)
      })
      .catch(() => {
        // Keep the seeded mock copy; the network layer already normalizes errors.
      })

    return () => {
      active = false
    }
    // The loader is a module-level function and never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return items
}

const loadServices = () => getServices()
const loadSolutions = () => getSolutions({ limit: 50 })
const loadProjects = () => getProjects({ limit: 50 })
const loadTeam = () => getTeam()
const loadTestimonials = () => getTestimonials({ limit: 50 })
const loadPosts = () => getPosts({ limit: 50 })
const loadFaqs = () => getFAQs()
const loadPricing = () => getPricing()
const loadStats = () => getStats()

export const useServices = () => useContent(mock.services, loadServices)
export const useSolutions = () => useContent(mock.solutions, loadSolutions)
export const useProjects = () => useContent(mock.projects, loadProjects)
export const useTeam = () => useContent(mock.team, loadTeam)
export const useTestimonials = () => useContent(mock.testimonials, loadTestimonials)
export const usePosts = () => useContent(mock.posts, loadPosts)
export const useFAQs = () => useContent(mock.faqs, loadFaqs)
export const usePricing = () => useContent(mock.pricing, loadPricing)
export const useStats = () => useContent(mock.stats, loadStats)

export default useContent
