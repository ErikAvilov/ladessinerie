import { AdminDashboard } from '@/components/admin-dashboard'
import { getIllustrations } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const illustrations = await getIllustrations()
  return <AdminDashboard initialIllustrations={illustrations} />
}
