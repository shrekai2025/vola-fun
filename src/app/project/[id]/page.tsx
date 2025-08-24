'use client'

import { ProjectDetailSection } from '@/components/sections/ProjectDetailSection'
import { useParams } from 'next/navigation'

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string // 现在实际传的是ID

  return (
    <div className='min-h-screen bg-background'>
      <ProjectDetailSection apiId={id} />
    </div>
  )
}
