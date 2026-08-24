import { AdminDashboard } from '@/components/admin-dashboard'
import { getIllustrations } from '@/lib/supabase'
import { getSiteTheme } from '@/lib/site-theme'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [illustrations, theme] = await Promise.all([getIllustrations(), getSiteTheme()])
  return <AdminDashboard initialIllustrations={illustrations} initialTheme={theme} />
}
