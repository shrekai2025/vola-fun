'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface FloatingPosition {
  x: number
  y: number
  rotation: number
}

interface GradientColors {
  hue1: number
  hue2: number
  saturation: number
  lightness: number
}

export function FloatingUFO() {
  const { theme } = useTheme()
  const [position, setPosition] = useState<FloatingPosition>({
    x: 0,
    y: 0,
    rotation: 0,
  })
  const [gradientColors, setGradientColors] = useState<GradientColors>({
    hue1: 180,
    hue2: 240,
    saturation: 70,
    lightness: 60,
  })
  const [isHovered, setIsHovered] = useState(false)
  const speedFactor = isHovered ? 3 : 1

  // 流星参数：仅在客户端生成，避免SSR/CSR不一致
  type Meteor = {
    delay: number
    repeatDelay: number
    duration: number
    startX: number
    startY: number
    endX: number
    endY: number
    length: number
  }
  const [meteorSeeds, setMeteorSeeds] = useState<Meteor[]>([])
  useEffect(() => {
    const count = 6
    const seeds: Meteor[] = Array.from({ length: count }).map(() => ({
      delay: Math.random() * 3,
      repeatDelay: 1.5 + Math.random() * 3,
      duration: 2.2 + Math.random() * 1.4,
      startX: -60 - Math.random() * 40,
      startY: -30 - Math.random() * 30,
      endX: 140 + Math.random() * 40,
      endY: 100 + Math.random() * 30,
      length: 90 + Math.random() * 60,
    }))
    setMeteorSeeds(seeds)
  }, [])

  // 过渡时长固定，避免渲染时使用随机数
  const baseDurationRef = useRef(2.5)

  // 生成随机位置和旋转角度
  const generateRandomPosition = (): FloatingPosition => {
    return {
      x: Math.random() * 30 - 15, // -15px 到 15px 的随机移动
      y: Math.random() * 20 - 10, // -10px 到 10px 的随机移动
      rotation: Math.random() * 4 - 2, // -2度 到 2度的随机旋转
    }
  }

  // 生成随机渐变色
  const generateRandomGradient = (): GradientColors => {
    const hue1 = Math.random() * 360
    const hue2 = (hue1 + 60 + Math.random() * 120) % 360 // 确保颜色有一定的对比度
    const saturation = 60 + Math.random() * 30 // 60-90% 饱和度
    const lightness = 50 + Math.random() * 20 // 50-70% 亮度

    return {
      hue1,
      hue2,
      saturation,
      lightness,
    }
  }

  // 持续更新位置和颜色
  useEffect(() => {
    const tick = () => {
      setPosition(generateRandomPosition())
      setGradientColors(generateRandomGradient())
    }
    const intervalMs = (3000 + Math.random() * 2000) / speedFactor // 3-5秒基础，随速度调整
    const interval = setInterval(tick, intervalMs)
    return () => clearInterval(interval)
  }, [speedFactor])

  const ufoSrc = theme === 'dark' ? '/ufowhite.svg' : '/ufoblack.svg'

  return (
    <>
      {/* 背景流星雨：固定于区域，不随UFO漂移 */}
      <div
        className='pointer-events-none absolute top-[78px] left-1/2 transform -translate-x-1/2 w-40 h-28 z-0'
        style={
          {
            WebkitMaskImage: 'radial-gradient(60% 45% at center, black 70%, transparent 100%)',
            maskImage: 'radial-gradient(60% 45% at center, black 70%, transparent 100%)',
          } as React.CSSProperties
        }
      >
        {meteorSeeds.map((m, idx) => (
          <motion.span
            key={`meteor-${idx}`}
            className='absolute block'
            style={
              {
                left: 0,
                top: 0,
                width: m.length,
                height: 1,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 100%)',
                transformOrigin: 'left center',
              } as React.CSSProperties
            }
            initial={{ x: m.startX, y: m.startY, rotate: 45, opacity: 0 }}
            animate={{ x: m.endX, y: m.endY, opacity: [0, 0.1, 0] }}
            transition={{
              duration: m.duration / speedFactor,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: m.repeatDelay / speedFactor,
              delay: m.delay / speedFactor,
            }}
          />
        ))}
      </div>

      <motion.div
        className='absolute top-[78px] left-1/2 transform -translate-x-1/2 w-24 h-24 opacity-70 z-10'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          x: position.x,
          y: position.y,
          rotate: position.rotation,
        }}
        transition={{
          duration: baseDurationRef.current / speedFactor,
          ease: 'easeInOut',
        }}
      >
        {/* 使用CSS mask将渐变裁剪为UFO形状 */}
        <motion.div
          className='w-full h-full'
          style={
            {
              WebkitMaskImage: `url(${ufoSrc})`,
              maskImage: `url(${ufoSrc})`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            } as React.CSSProperties
          }
          animate={{
            background: [
              `linear-gradient(135deg, hsl(${gradientColors.hue1}, ${gradientColors.saturation}%, ${gradientColors.lightness}%), hsl(${gradientColors.hue2}, ${gradientColors.saturation}%, ${gradientColors.lightness}%))`,
              `linear-gradient(315deg, hsl(${gradientColors.hue2}, ${gradientColors.saturation}%, ${gradientColors.lightness}%), hsl(${gradientColors.hue1}, ${gradientColors.saturation}%, ${gradientColors.lightness}%))`,
            ],
          }}
          transition={{
            duration: isHovered ? 1 : 3,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.div>
    </>
  )
}
