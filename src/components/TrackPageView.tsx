'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    __pageViewEventId?: string
    fbq?: (...args: unknown[]) => void
  }
}

function uuidV4(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getTestEventCode(): string {
  try {
    const url = new URL(window.location.href)
    const fromUrl = url.searchParams.get('test_event_code')
    if (fromUrl) {
      sessionStorage.setItem('_tec', fromUrl)
      return fromUrl
    }
    return sessionStorage.getItem('_tec') ?? ''
  } catch {
    return ''
  }
}

export default function TrackPageView() {
  useEffect(() => {
    const eventId = uuidV4()
    window.__pageViewEventId = eventId
    const testEventCode = getTestEventCode()

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView', {}, { eventID: eventId })
    }

    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: 'PageView',
        event_id: eventId,
        ...(testEventCode && { test_event_code: testEventCode }),
      }),
    }).catch(() => {})
  }, [])

  return null
}
