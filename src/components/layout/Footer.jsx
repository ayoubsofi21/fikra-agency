import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Mail, Phone, MapPin, Clock, Github, Linkedin, Instagram, Facebook, Check } from 'lucide-react'
import { useLang } from '@/context/LangProvider'
import { SOCIAL_LINKS, CONTACT_METHODS } from '@/utils/constants'
import { cn } from '@/utils/helpers'

const socials = SOCIAL_LINKS
const socialIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
}
const contactIcons = { Mail, Phone, MapPin, Clock }

export const Footer = () => {
  const { t, lang } = useLang()
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = new FormData(form).get('email')
    if (!email) return
    // Mock subscription — no backend yet
    setSubscribed(true)
    form.reset()
  }

  const quickLinks = [
    { label: 'nav.services', href: '/services' },
    { label: 'nav.solutions', href: '/solutions' },
    { label: 'nav.portfolio', href: '/portfolio' },
    { label: 'nav.about', href: '/about' },
    { label: 'nav.team', href: '/team' },
    { label: 'nav.pricing', href: '/pricing' },
    { label: 'nav.blog', href: '/blog' },
    { label: 'nav.contact', href: '/contact' },
  ]

  const servicesLinks = [
    { label: 'services.customWeb', href: '/services#web-development' },
    { label: 'services.ecommerce', href: '/services#e-commerce' },
    { label: 'services.platform', href: '/services#custom-platforms-saas' },
    { label: 'services.design', href: '/services#ui-ux-design' },
    { label: 'services.backend', href: '/services#rest-api-backend' },
    { label: 'services.support', href: '/services#maintenance-support' },
  ]

  const solutionLinks = [
    { label: 'solutions.invoice', href: '/solutions#invoice-management' },
    { label: 'solutions.leave', href: '/solutions#leave-management' },
    { label: 'solutions.events', href: '/solutions#event-ticketing' },
    { label: 'solutions.resume', href: '/solutions#resume-builder-saas' },
    { label: 'solutions.restaurant', href: '/solutions#restaurant-ordering' },
    { label: 'solutions.medical', href: '/solutions#medical-practice' },
  ]

  const legalLinks = [
    { label: 'legal.privacy', href: '/privacy' },
    { label: 'legal.terms', href: '/terms' },
  ]

  return (
    <footer className={cn('bg-[#0B1020] text-white pt-20 pb-8', lang === 'ar' ? 'font-sans' : '')}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-semibold text-2xl">
                F
              </div>
              <span className="font-semibold text-2xl tracking-tight">{t('common.brandFull')}</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40">
                  {(() => {
                    const Icon = socialIcons[s.icon] || ExternalLink
                    return <Icon className="w-5 h-5" />
                  })()}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-6">{t('footer.quickLinks')}</h2>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    {t(item.label)}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-6">{t('footer.servicesLinks')}</h2>
            <ul className="space-y-3">
              {servicesLinks.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-6">{t('footer.solutionsLinks')}</h2>
            <ul className="space-y-3">
              {solutionLinks.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-semibold text-lg mb-6">{t('common.contact')}</h2>
            <div className="space-y-4">
              {CONTACT_METHODS.map((m) => (
                <div key={m.type} className="flex items-start gap-3 text-slate-300">
                  {(() => {
                    const Icon = contactIcons[m.icon] || ExternalLink
                    return <Icon className="w-5 h-5 text-indigo-400 mt-0.5" />
                  })()}
                  <span className="leading-relaxed">{m.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-slate-400 text-sm mb-2">{t('footer.newsletter.headline')}</p>
              {subscribed ? (
                <p role="status" className="flex items-center gap-2 text-sm text-emerald-400">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  {t('footer.newsletter.success', 'Subscribed!')}
                </p>
              ) : (
                <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                  <input type="email" name="email" required aria-label={t('footer.newsletter.placeholder')} placeholder={t('footer.newsletter.placeholder')} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 flex-1 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40" />
                  <button type="submit" className="bg-primary hover:bg-indigo-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    {t('footer.newsletter.subscribe')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} {t('common.brandFull')}. {t('footer.copyright')}</p>
            <div className="flex gap-6">
              {legalLinks.map((item) => (
                <Link key={item.href} to={item.href} className="hover:text-white transition-colors">
                  {t(item.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
