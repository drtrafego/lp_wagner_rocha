'use client'
import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  type?: 'up' | 'left' | 'right' | 'scale'
  delay?: number
}

export default function ScrollReveal({ children, className = '', type = 'up', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const typeClass = {
      up: 'reveal',
      left: 'reveal-left',
      right: 'reveal-right',
      scale: 'reveal-scale',
    }[type]

    el.classList.add(typeClass)
    if (delay) el.style.transitionDelay = `${delay}s`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [type, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
