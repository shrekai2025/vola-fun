'use client'

import { useParams } from 'next/navigation'
import { ProjectDetailSection } from '@/components/sections/ProjectDetailSection'

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  return (
    <div className='min-h-screen bg-background'>
      <ProjectDetailSection slug={slug} />
    </div>
  )
}
