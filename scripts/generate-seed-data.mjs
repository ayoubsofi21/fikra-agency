/**
 * Generates database/seed_data/*.json from the React frontend's mock store,
 * so seeded content stays byte-identical to what the frontend renders today.
 *
 * Usage (from the API repo root):
 *   node scripts/generate-seed-data.mjs
 *
 * Sources (frontend repo, read-only):
 *   ../fikra-agency/src/data/mock.js        — content
 *   ../fikra-agency/src/utils/constants.js  — SITE / IMG / SOCIAL_LINKS / WHATSAPP_NUMBER
 *
 * Mapping rules (mock key -> DB column):
 *   name/short/description  -> title/short_description/description   (translatable)
 *   string scalars           -> wrapped { en: value } into translatable columns
 *   plain string arrays      -> { en: [...] } (mock is EN-only for lists)
 *   pricing features         -> kept as [ { en, fr, ar }, ... ] (comparison table identity)
 *   priceModel 'license'    -> pricing_model 'one_time' (API resource maps back)
 *   faq category            -> group: general->general, pricing->pricing,
 *                              solutions->services, support->services
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(__dirname, '../../fikra-agency')
const OUT_DIR = path.resolve(__dirname, '../database/seed_data')
fs.mkdirSync(OUT_DIR, { recursive: true })

const mockSrc = fs.readFileSync(path.join(FRONTEND, 'src/data/mock.js'), 'utf8')
const constSrc = fs.readFileSync(path.join(FRONTEND, 'src/utils/constants.js'), 'utf8')

// --- extract top-level consts from constants.js (blocks close with "\n}" at col 0) ---
const grabBlock = (name) => {
  const m = constSrc.match(new RegExp(`export const ${name} = [\\s\\S]*?\\n[}\\]]`))
  if (!m) throw new Error(`could not extract ${name} from constants.js`)
  return m[0].replace('export const', 'const')
}
const grabScalar = (name) => {
  const m = constSrc.match(new RegExp(`export const ${name} = (.+)`))
  if (!m) throw new Error(`could not extract ${name} from constants.js`)
  return `const ${name} = ${m[1]}`
}

// --- assemble a temp ESM module: constants + mock body (import line stripped) ---
const mockBody = mockSrc.replace(/^import .*$/m, '')
const tmp = '/tmp/opencode/mock-seed-source.mjs'
fs.mkdirSync(path.dirname(tmp), { recursive: true })
fs.writeFileSync(
  tmp,
  [
    grabBlock('IMG'),
    grabBlock('SITE'),
    grabBlock('SOCIAL_LINKS'),
    grabScalar('WHATSAPP_NUMBER'),
    'export { IMG, SITE, SOCIAL_LINKS, WHATSAPP_NUMBER }',
    mockBody,
  ].join('\n\n'),
)

const mod = await import(pathToFileURL(tmp).href)
const { SITE, SOCIAL_LINKS, WHATSAPP_NUMBER } = mod
const mock = mod

// --- helpers -------------------------------------------------------------
const write = (name, data) => {
  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(data, null, 2) + '\n')
  const n = Array.isArray(data) ? data.length : Object.keys(data).length
  console.log(`  ${name}.json  (${n} ${Array.isArray(data) ? 'rows' : 'keys'})`)
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const firstSentence = (s) => {
  const m = String(s).match(/^[^.!?]+[.!?]/)
  return (m ? m[0] : String(s)).trim()
}

const PRICE_MODEL = { license: 'one_time', subscription: 'subscription', custom: 'custom' }
const FAQ_GROUP = { general: 'general', pricing: 'pricing', solutions: 'services', support: 'services' }

const CATEGORY_NAMES = {
  business: { en: 'Business', fr: 'Entreprise', ar: 'الأعمال' },
  events: { en: 'Events', fr: 'Événements', ar: 'الفعاليات' },
  saas: { en: 'SaaS', fr: 'SaaS', ar: 'SaaS' },
  food: { en: 'Food & Restaurants', fr: 'Restauration', ar: 'المطاعم' },
  health: { en: 'Health', fr: 'Santé', ar: 'الصحة' },
  commerce: { en: 'Commerce', fr: 'Commerce', ar: 'التجارة' },
}

console.log('Generating seed data from frontend mock...')

// --- content -------------------------------------------------------------
const services = mock.services.map((s, i) => ({
  slug: s.slug,
  icon: s.icon ?? null,
  category: s.category ?? 'development',
  title: s.name,
  short_description: s.short,
  description: s.description,
  deliverables: s.deliverables ? { en: s.deliverables } : null,
  technologies: s.technologies ?? null,
  timeline: s.timeline ? (typeof s.timeline === 'string' ? { en: s.timeline } : s.timeline) : null,
  price_model: s.price?.model ?? 'custom',
  price_from: s.price?.from ?? null,
  price_currency: s.price?.currency ?? 'USD',
  price_period: s.price?.period ?? null,
  is_featured: !!s.featured,
  is_active: true,
  order: i + 1,
}))
write('services', services)

// solution categories: distinct slugs from mock, translated display names
const solutionSlugs = [...new Set(mock.solutions.map((s) => s.category))]
const solutionCategories = solutionSlugs.map((slug) => ({
  slug,
  name: CATEGORY_NAMES[slug] ?? { en: slug },
}))
write('solution_categories', solutionCategories)

const solutions = mock.solutions.map((s, i) => ({
  slug: s.slug,
  category_slug: s.category,
  title: s.name,
  short_description: firstSentence(s.description.en),
  description: s.description,
  technologies: s.technologies ?? null,
  demo_url: s.demo ?? null,
  pricing_model: PRICE_MODEL[s.priceModel] ?? 'one_time',
  price: s.price?.amount ?? null,
  currency: s.price?.currency ?? 'USD',
  badge: s.badge ?? null,
  type: s.type ?? 'template',
  license_type: s.licenseType ?? null,
  rating: s.rating ?? null,
  image: s.image ?? null,
  is_featured: false,
  is_active: true,
  order: i + 1,
}))
write('solutions', solutions)

const solutionFeatures = mock.solutions.flatMap((s) =>
  (s.features ?? []).map((feature, j) => ({
    solution_slug: s.slug,
    title: { en: feature },
    description: null,
    order: j + 1,
  })),
)
write('solution_features', solutionFeatures)

const projects = mock.projects.map((p, i) => ({
  slug: p.slug,
  category: p.category,
  title: p.title,
  client_name: p.client ?? null,
  summary: p.description,
  problem: p.challenge ?? null,
  solution: p.solution ?? null,
  result: p.result ?? null,
  technologies: p.technologies ?? null,
  live_url: p.liveLink ?? null,
  completed_at: p.year ? `${p.year}-01-01` : null,
  image: p.image ?? null,
  cover: p.cover ?? null,
  gallery: p.gallery ?? null,
  is_featured: !!p.featured,
  is_active: true,
  order: i + 1,
}))
write('projects', projects)

const team = mock.team.map((m, i) => ({
  name: m.name,
  role: m.role,
  bio: m.bio ?? null,
  skills: m.skills ?? null,
  github_url: m.github ?? null,
  linkedin_url: m.linkedin ?? null,
  twitter: m.twitter ?? null,
  avatar: m.avatar ?? null,
  email: m.email ?? null,
  featured: !!m.featured,
  order: i + 1,
  is_active: true,
}))
write('team_members', team)

const testimonials = mock.testimonials.map((t, i) => ({
  author_name: t.name,
  author_role: t.role,
  company: t.company ?? null,
  content: t.content,
  avatar: t.avatar ?? null,
  project_type: t.projectType ?? null,
  rating: t.rating ?? 5,
  order: i + 1,
  is_active: true,
}))
write('testimonials', testimonials)

// posts + their categories (derived from each post's translated category object)
const postCategoryMap = new Map()
for (const p of mock.posts) {
  const slug = slugify(p.category.en)
  if (!postCategoryMap.has(slug)) postCategoryMap.set(slug, { slug, name: p.category })
}
write('post_categories', [...postCategoryMap.values()])

const posts = mock.posts.map((p) => ({
  slug: p.slug,
  category_slug: slugify(p.category.en),
  author_name: p.author ?? null,
  title: p.title,
  excerpt: p.excerpt ?? null,
  content: p.content,
  cover: p.cover ?? null,
  reading_time: p.readTime ?? 5,
  status: p.published === false ? 'draft' : 'published',
  published_at: p.date ?? null,
  seo_title: null,
  seo_description: null,
}))
write('posts', posts)

const faqs = mock.faqs.map((f, i) => ({
  group: FAQ_GROUP[f.category.en] ?? 'general',
  question: f.question,
  answer: f.answer,
  order: i + 1,
  is_active: true,
}))
write('faqs', faqs)

const pricing = mock.pricing.map((p, i) => ({
  key: slugify(p.name.en),
  name: p.name,
  description: null,
  tagline: p.tagline ?? null,
  cta: p.cta ?? null,
  price_monthly: p.price.monthly,
  price_yearly: p.price.yearly,
  price_one_time: p.price.oneTime,
  currency: p.price.currency ?? 'USD',
  features: p.features, // [ { en, fr, ar } ] — identity-compared in the pricing table
  is_popular: !!p.popular,
  order: i + 1,
  is_active: true,
}))
write('pricing_plans', pricing)

// site-level settings (constants.js) + stats counters (mock.stats)
const stats = mock.stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label }))
write('settings', {
  site: SITE,
  social: SOCIAL_LINKS,
  whatsapp: WHATSAPP_NUMBER,
  stats,
})

console.log('Done.')
