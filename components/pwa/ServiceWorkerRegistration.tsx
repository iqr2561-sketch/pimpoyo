'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/pwa'

export const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return null
}
