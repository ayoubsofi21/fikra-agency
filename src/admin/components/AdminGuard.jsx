import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldAlert } from 'lucide-react'
import { useAdminAuth } from '@/admin/context/AdminAuthContext'
import AdminLayout from './AdminLayout'
import { EmptyState, Spinner } from './ui'

export default function AdminGuard({ permission, children }) {
  const { t } = useTranslation()
  const { status, can } = useAdminAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center bg-surface"><Spinner className="h-8 w-8 text-primary" /></div>
  }

  if (status !== 'authenticated') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return (
    <AdminLayout>
      {permission && !can(permission) ? (
        <EmptyState icon={ShieldAlert} title={t('admin.noPermission')} description={t('admin.noPermissionDesc')} />
      ) : children}
    </AdminLayout>
  )
}
