import { lazy, Suspense } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/admin/components/Toast'
import AdminGuard from '@/admin/components/AdminGuard'
import AdminLogin from '@/admin/pages/Login'
import AdminDashboard from '@/admin/pages/Dashboard'
import AdminInbox from '@/admin/pages/Inbox'
import AdminMedia from '@/admin/pages/Media'
import AdminSettings from '@/admin/pages/Settings'
import ResourceManager from '@/admin/components/ResourceManager'
import { resources } from '@/admin/config/resources'
import { useAdminAuth } from '@/admin/context/AdminAuthContext'

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
const ResetPasswordPage = lazyDefault('ResetPassword')
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

const ResourceRoute = () => {
  const { resource } = useParams()
  // URLs are kebab-case, config keys camelCase (solution-features -> solutionFeatures).
  const configKey = resource?.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  const config = resources[configKey]
  const { can } = useAdminAuth()
  const toast = useToast()

  if (!config) return <NotFoundPage />
  if (!can(config.permission)) return <NoAccess />

  return <ResourceManager key={resource} config={config} onToast={toast} />
}

const InboxRoute = () => {
  const { type } = useParams()
  if (!['quotes', 'messages', 'newsletter'].includes(type)) return <NotFoundPage />
  return <AdminInbox type={type} />
}

const NoAccess = () => {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border border-border bg-background p-8 text-center">
      <p className="font-semibold text-text">{t('admin.noPermission')}</p>
      <p className="mt-1 text-sm text-muted">{t('admin.noPermissionDesc')}</p>
    </div>
  )
}

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
      <Route path="/reset-password" element={Page(<ResetPasswordPage />)} />
      <Route path="/privacy" element={Page(<PrivacyPage />)} />
      <Route path="/terms" element={Page(<TermsPage />)} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
      <Route path="/admin/content/:resource" element={<AdminGuard permission="manage-content"><ResourceRoute /></AdminGuard>} />
      <Route path="/admin/inbox/:type" element={<AdminGuard permission="manage-inbox"><InboxRoute /></AdminGuard>} />
      <Route path="/admin/media" element={<AdminGuard permission="manage-media"><AdminMedia /></AdminGuard>} />
      <Route path="/admin/settings" element={<AdminGuard permission="manage-settings"><AdminSettings /></AdminGuard>} />
      <Route path="*" element={Page(<NotFoundPage />)} />
    </Routes>
  )
}

export default AppRoutes
