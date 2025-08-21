'use client'

import { HeroSection } from '@/components/sections/HeroSection'
import APIMarketSection from '@/components/sections/APIMarketSection'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* API Market Section with Real Data */}
      <APIMarketSection />
    </>
  )
}