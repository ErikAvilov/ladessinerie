import { notFound } from 'next/navigation'
import { AdminEditIllustration } from '@/components/admin-edit-illustration'
import { getIllustrationById } from '@/lib/illustrations'

export const dynamic = 'force-dynamic'

type EditIllustrationPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditIllustrationPage({ params }: EditIllustrationPageProps) {
  const { id } = await params
  const illustration = await getIllustrationById(id)

  if (!illustration) notFound()

  return <AdminEditIllustration illustration={illustration} />
}
