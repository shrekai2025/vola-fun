'use client'

import { HeroSection } from '@/components/sections/HeroSection'
import APIMarketSectionV2 from '@/components/sections/APIMarketSectionV2'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* API Market Section with Real Data - V2 Optimized */}
      <APIMarketSectionV2 />
    </>
  )
}