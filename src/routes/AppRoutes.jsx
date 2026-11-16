import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const modules = import.meta.glob('../pages/*.jsx')

const getModule = (name) => {
  const loader = modules[`../pages/${name}.jsx`]
  if (!loader) throw new Error(`[routes] Missing page module: ${name}`)
  return loader()
}

const lazyDefault = (name) => lazy(() => getModule(name))
const lazyNamed = (name, exportName) =>
  lazy(() => getModule(name).then((mod) => ({ default: mod[exportName] })))

const HomePage = lazyDefault('Home')
const ServicesPage = lazyDefault('Services')
const ServiceDetailPage = lazyDefault('ServiceDetail')
const SolutionsPage = lazyDefault('Solutions')
const SolutionDetailPage = lazyDefault('SolutionDetail')
const PortfolioPage = lazyDefault('Portfolio')
const ProjectDetailPage = lazyDefault('ProjectDetail')
const AboutPage = lazyDefault('About')
const TeamPage = lazyDefault('Team')
const PricingPage = lazyDefault('Pricing')
const BlogPage = lazyDefault('Blog')
const BlogPostPage = lazyDefault('BlogPost')
const ContactPage = lazyDefault('Contact')
const FaqPage = lazyDefault('Faq')
const PrivacyPage = lazyNamed('Legal', 'Privacy')
const TermsPage = lazyNamed('Legal', 'Terms')
const NotFoundPage = lazyDefault('NotFound')

const loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
    <span className="sr-only">Loading…</span>
  </div>
)

const Page = (element) => <Suspense fallback={loading()}>{element}</Suspense>

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={Page(<HomePage />)} />
      <Route path="/services" element={Page(<ServicesPage />)} />
      <Route path="/services/:slug" element={Page(<ServiceDetailPage />)} />
      <Route path="/solutions" element={Page(<SolutionsPage />)} />
      <Route path="/solutions/:slug" element={Page(<SolutionDetailPage />)} />
      <Route path="/portfolio" element={Page(<PortfolioPage />)} />
      <Route path="/portfolio/:slug" element={Page(<ProjectDetailPage />)} />
      <Route path="/about" element={Page(<AboutPage />)} />
      <Route path="/team" element={Page(<TeamPage />)} />
      <Route path="/pricing" element={Page(<PricingPage />)} />
      <Route path="/blog" element={Page(<BlogPage />)} />
      <Route path="/blog/:slug" element={Page(<BlogPostPage />)} />
      <Route path="/contact" element={Page(<ContactPage />)} />
      <Route path="/faq" element={Page(<FaqPage />)} />
      <Route path="/privacy" element={Page(<PrivacyPage />)} />
      <Route path="/terms" element={Page(<TermsPage />)} />
      <Route path="*" element={Page(<NotFoundPage />)} />
    </Routes>
  )
}

export default AppRoutes
