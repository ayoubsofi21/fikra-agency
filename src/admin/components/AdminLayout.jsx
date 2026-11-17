import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Wrench, Blocks, ListChecks, FolderKanban, Newspaper, Tags, UsersRound,
  Quote, CircleHelp, CreditCard, FileText, Mail, Send, Images, Settings as SettingsIcon,
  ShieldCheck, Menu, X, LogOut, ExternalLink, ChevronDown, UserRound,
} from 'lucide-react'
import { useAdminAuth } from '@/admin/context/AdminAuthContext'
import { contentNav, inboxNav } from '@/admin/config/resources'
import { cx } from './ui'

const icons = {
  LayoutDashboard, Wrench, Blocks, ListChecks, FolderKanban, Newspaper, Tags, UsersRound,
  Quote, CircleHelp, CreditCard, FileText, Mail, Send, Images, Settings: SettingsIcon,
  ShieldCheck,
}

const otherNav = [
  { key: 'media', path: '/admin/media', icon: Images, label: 'admin.media', permission: 'manage-media' },
  { key: 'settings', path: '/admin/settings', icon: SettingsIcon, label: 'admin.settings', permission: 'manage-settings' },
  { key: 'users', path: '/admin/content/users', icon: ShieldCheck, label: 'admin.users', permission: 'manage-users' },
]

function NavSection({ title, links, can, onNavigate }) {
  const { t } = useTranslation()
  const visible = links.filter((link) => !link.permission || can(link.permission))
  if (!visible.length) return null

  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted/60">{title}</p>
      <div className="space-y-1">
        {visible.map((link) => {
          const Icon = typeof link.icon === 'string' ? icons[link.icon] : link.icon
          return (
            <NavLink
              key={link.key}
              to={link.path}
              end={link.exact}
              onClick={onNavigate}
              className={({ isActive }) => cx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive ? 'bg-primary/10 font-medium text-primary' : 'text-muted hover:bg-surfaceAlt hover:text-text',
              )}
            >
              {Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}
              <span className="truncate">{t(link.label)}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const { t } = useTranslation()
  const { user, logout, can, isAdmin } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)

  const doLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">F</div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{t('admin.brand')}</p>
          <p className="truncate text-[11px] text-muted">fikra.agency</p>
        </div>
        <button type="button" className="ms-auto rounded-lg p-1 text-muted lg:hidden" onClick={() => setMobileOpen(false)} aria-label={t('admin.close')}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        <NavSection title={t('admin.dashboard')} links={contentNav.slice(0, 1)} can={can} onNavigate={() => setMobileOpen(false)} />
        <NavSection title={t('admin.content')} links={contentNav.slice(1)} can={can} onNavigate={() => setMobileOpen(false)} />
        <NavSection title={t('admin.inbox')} links={inboxNav} can={can} onNavigate={() => setMobileOpen(false)} />
        <NavSection title={t('admin.account')} links={otherNav} can={can} onNavigate={() => setMobileOpen(false)} />
      </nav>

      <div className="border-t border-border p-3">
        <a href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surfaceAlt hover:text-text">
          <ExternalLink className="h-4 w-4" /> {t('admin.publicSite')}
        </a>
      </div>
    </div>
  )

  const pageTitle = t(contentNav.find((link) => link.path === location.pathname)?.label
    || inboxNav.find((link) => link.path === location.pathname)?.label
    || otherNav.find((link) => link.path === location.pathname)?.label
    || 'admin.dashboard')

  return (
    <div className="min-h-screen bg-surface" dir={undefined}>
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e border-border bg-background lg:block">{sidebar}</aside>

      {/* mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[900] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-background shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:ps-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <button type="button" className="rounded-lg p-2 text-muted hover:bg-surfaceAlt lg:hidden" onClick={() => setMobileOpen(true)} aria-label={t('admin.responsiveMenu')}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="truncate text-sm font-semibold text-text">{pageTitle}</h1>

          <div className="ms-auto flex items-center gap-2">
            <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
              {isAdmin ? t('admin.admin') : t('admin.editor')}
            </span>
            <div className="relative">
              <button type="button" onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surfaceAlt">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surfaceAlt text-muted">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="hidden max-w-32 truncate text-xs font-medium text-text sm:block">{user?.name}</span>
                <ChevronDown className="h-4 w-4 text-muted" />
              </button>
              {userMenu && (
                <div className="absolute end-0 top-full mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-lg">
                  <div className="border-b border-border px-2 py-2">
                    <p className="truncate text-sm font-medium text-text">{user?.name}</p>
                    <p className="truncate text-xs text-muted">{user?.email}</p>
                  </div>
                  <button type="button" onClick={doLogout} className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-danger hover:bg-danger/10">
                    <LogOut className="h-4 w-4" /> {t('admin.signOut')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
