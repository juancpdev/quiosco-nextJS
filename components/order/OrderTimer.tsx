'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

type OrderTimerProps = {
  orderDate: Date | string
}

export default function OrderTimer({ orderDate }: OrderTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState('')
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    const calculateElapsed = () => {
      const start = new Date(orderDate).getTime()
      const now = Date.now()
      const diff = now - start

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      // Marcar como "urgente" después de 30 minutos
      setIsOverdue(minutes >= 30 || hours > 0)

      const formattedHours = String(hours).padStart(2, '0')
      const formattedMinutes = String(minutes).padStart(2, '0')

      setTimeElapsed(`${formattedHours}h:${formattedMinutes}m`)
    }

    calculateElapsed()
    const interval = setInterval(calculateElapsed, 1000)

    return () => clearInterval(interval)
  }, [orderDate])

  return (
    <div 
      className={`
        flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-xs transition-colors
        ${isOverdue 
          ? 'bg-red-100 text-red-700 border border-red-300' 
          : 'bg-blue-100 text-blue-700 border border-blue-300'
        }
      `}
    >
      <Clock size={12} className={isOverdue ? 'animate-pulse' : ''} />
      <span className="font-mono">{timeElapsed}</span>
    </div>
  )
}