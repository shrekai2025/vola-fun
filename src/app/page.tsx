'use client'

import APIMarketSection from '@/components/sections/APIMarketSection'
import { HeroSection } from '@/components/sections/HeroSection'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* API Market Section with Real Data - V2 Optimized */}
      <APIMarketSection />
    </>
  )
}
