'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/design-system'

type Props = {
  priceId: string
  label: string
  className?: string
  style?: React.CSSProperties
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function PlanButton({ priceId, label, className = "", style, variant = "primary" }: Props) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erro ao iniciar checkout: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Erro inesperado no checkout.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      disabled={loading}
      onClick={handleCheckout}
      className={`${className} disabled:opacity-50 transition-all active:scale-95`}
      style={style}
    >
      {loading ? 'Processando...' : label}
    </button>
  )
}
