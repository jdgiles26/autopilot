'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  texts: string[]
  speed?: number
  pauseMs?: number
  className?: string
  prefix?: string
}

export function TypewriterText({ texts, speed = 50, pauseMs = 2000, className, prefix = '' }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = texts[textIndex]

    if (!isDeleting && charIndex < current.length) {
      const timer = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        setCharIndex(i => i + 1)
      }, speed)
      return () => clearTimeout(timer)
    }

    if (!isDeleting && charIndex === current.length) {
      const timer = setTimeout(() => setIsDeleting(true), pauseMs)
      return () => clearTimeout(timer)
    }

    if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex(i => i - 1)
      }, speed / 2)
      return () => clearTimeout(timer)
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setTextIndex(i => (i + 1) % texts.length)
    }
  }, [charIndex, isDeleting, textIndex, texts, speed, pauseMs])

  return (
    <span className={className}>
      {prefix}{displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="ml-0.5 inline-block w-0.5 h-[1em] bg-current align-middle"
      />
    </span>
  )
}
