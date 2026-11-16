/**
 * Fikra Agency - Global Constants
 */

export const SITE = {
  name: 'FIKRA Agency',
  tagline: 'From idea to digital reality',
  description:
    'We build custom websites, reusable digital solutions, and SaaS-style tools for businesses worldwide. From Morocco to the world.',
  email: 'contact@fikra.agency',
  phone: '+212 6 00 00 00 00',
  location: 'Morocco — remote-friendly, working with clients worldwide',
  workingHours: 'Mon–Fri, 9:00–18:00 (GMT+0)',
  locale: 'en-US',
}

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇲🇦', rtl: true },
]

export const DEFAULT_LANGUAGE = 'en'

/**
 * API configuration
 * Set VITE_USE_MOCK=true to return mock data with a fake delay.
 * Set VITE_API_URL to your real endpoint to bypass mocks.
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
}

export const API_ENDPOINTS = {
  services: '/services',
  solutions: '/solutions',
  projects: '/projects',
  team: '/team',
  testimonials: '/testimonials',
  posts: '/posts',
  faqs: '/faqs',
  pricing: '/pricing',
  stats: '/stats',
  contact: '/contact',
}

export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/:slug',
  SOLUTIONS: '/solutions',
  SOLUTION_DETAIL: '/solutions/:slug',
  PORTFOLIO: '/portfolio',
  PROJECT_DETAIL: '/portfolio/:slug',
  ABOUT: '/about',
  TEAM: '/team',
  PRICING: '/pricing',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOT_FOUND: '*',
}

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: 'https://github.com/fikra-agency', icon: 'GitHub' },
  { name: 'LinkedIn', url: 'https://linkedin.com/company/fikra-agency', icon: 'LinkedIn' },
  { name: 'Instagram', url: 'https://instagram.com/fikra.agency', icon: 'Instagram' },
  { name: 'Facebook', url: 'https://facebook.com/fikra.agency', icon: 'Facebook' },
]

export const NAV_LINKS = [
  { label: 'home', href: ROUTES.HOME },
  { label: 'services', href: ROUTES.SERVICES },
  { label: 'solutions', href: ROUTES.SOLUTIONS },
  { label: 'portfolio', href: ROUTES.PORTFOLIO },
  { label: 'about', href: ROUTES.ABOUT },
  { label: 'pricing', href: ROUTES.PRICING },
  { label: 'blog', href: ROUTES.BLOG },
  { label: 'contact', href: ROUTES.CONTACT },
]

export const CONTACT_METHODS = [
  { type: 'email', value: SITE.email, icon: 'Mail' },
  { type: 'phone', value: SITE.phone, icon: 'Phone' },
  { type: 'location', value: SITE.location, icon: 'MapPin' },
  { type: 'hours', value: SITE.workingHours, icon: 'Clock' },
]

export const NAVBAR_HEIGHT = 80
export const SCROLL_PROGRESS_BAR = true
export const FLOATING_WHATSAPP = true
export const WHATSAPP_NUMBER = '212600000000'

/**
 * Image placeholder service (unsplash source with keywords)
 */
export const IMG = {
  hero: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80',
  solutions: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  team: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  project: (i) => `https://images.unsplash.com/photo-${
    ['1498050108023-c5249f4df085', '1556742049-0cfed4f6a45d', '1522071820081-009f0129c71c', '1516321318423-f06f85e504b3', '1542744173-8e7e53415bb0', '1454165804606-c3d57bc86b40'][i % 6]
  }?w=800&q=80`,
  logo: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=200&q=80',
}
