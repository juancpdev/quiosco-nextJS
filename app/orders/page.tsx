"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import Heading from "@/components/ui/Heading"
import { OrderWithProducts } from "@/src/types"
import Logo from "@/components/ui/Logo"
import LatestOrderItem from "@/components/order/LatestOrderItem"
import Masonry from "react-masonry-css"
import { Volume2, VolumeX, Calendar } from "lucide-react"

export default function OrdersPage() {
  const url = "/orders/api"
  const fetcher = () => fetch(url).then((res) => res.json())
  const previousOrderIdsRef = useRef<Set<number>>(new Set())
  const [newOrderIds, setNewOrderIds] = useState<Set<number>>(new Set())
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Por defecto seleccionar hoy
    return new Date().toISOString().split('T')[0]
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Funciones para manejar fechas
  const getDateOptions = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    return [
      {
        label: 'Ayer',
        value: yesterday.toISOString().split('T')[0],
        display: yesterday.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long'
        })
      },
      {
        label: 'Hoy',
        value: today.toISOString().split('T')[0],
        display: today.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long'
        })
      }
    ]
  }


  const { data, error, isLoading } = useSWR<OrderWithProducts[]>(url, fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: false,
  })

  const breakpointColumns = {
    default: 3,
    1280: 3,
    1024: 2,
    640: 1,
  }

  // Filtrar solo órdenes locales (mesas) y por fecha seleccionada
  const localOrders = useMemo(
    () => data?.filter(order => order.deliveryType === 'local') || [],
    [data]
  )
  const filteredOrders = useMemo(
    () => localOrders.filter(order => {
      if (!order.orderReadyAt) return false
      const orderDate = new Date(order.orderReadyAt).toISOString().split('T')[0]
      return orderDate === selectedDate
    }),
    [localOrders, selectedDate]
  )

  // Toggle para habilitar/deshabilitar audio
  const toggleAudio = async () => {
    if (!audioEnabled && audioRef.current) {
      try {
        // Desbloquear audio reproduciendo silencio
        audioRef.current.volume = 0
        await audioRef.current.play()
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.volume = 1
        
        setAudioEnabled(true)
        console.log('✅ Audio habilitado')
      } catch (error) {
        console.error('❌ Error al habilitar audio:', error)
        alert('No se pudo activar el audio. Verifica los permisos del navegador.')
      }
    } else {
      // Deshabilitar audio
      setAudioEnabled(false)
      console.log('🔇 Audio deshabilitado')
    }
  }

  // Detectar nuevas órdenes y reproducir sonido
  useEffect(() => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current)
      highlightTimeoutRef.current = null
    }

    if (filteredOrders.length === 0) {
      previousOrderIdsRef.current = new Set()
      return
    }

    // Usar IDs en lugar del array completo para evitar re-renders innecesarios
    const currentOrderIds = new Set(filteredOrders.map(order => order.id))
    const previousOrderIds = previousOrderIdsRef.current

    // Si es la primera carga, solo guardar los IDs
    if (previousOrderIds.size === 0) {
      previousOrderIdsRef.current = currentOrderIds
      return
    }

    // Encontrar órdenes nuevas (que no estaban antes)
    const newIds = new Set<number>()
    currentOrderIds.forEach(id => {
      if (!previousOrderIds.has(id)) {
        newIds.add(id)
      }
    })

    // Si hay órdenes nuevas
    if (newIds.size > 0) {
      console.log('🔔 Nueva(s) orden(es) detectada(s):', Array.from(newIds))

      setNewOrderIds(prev => {
        if (prev.size === newIds.size) {
          let same = true
          for (const id of newIds) {
            if (!prev.has(id)) {
              same = false
              break
            }
          }
          if (same) return prev
        }
        return newIds
      })

      // Reproducir sonido si está habilitado
      if (audioEnabled && audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
          .then(() => console.log('🔊 Sonido reproducido'))
          .catch(err => {
            console.error('❌ Error al reproducir sonido:', err)
            setAudioEnabled(false)
          })
      } else if (!audioEnabled) {
        console.warn('⚠️ Audio no habilitado')
      }

      // Quitar el highlight después de 8 segundos
      highlightTimeoutRef.current = setTimeout(() => {
        setNewOrderIds(new Set())
        highlightTimeoutRef.current = null
      }, 8000)
    }

    // Actualizar los IDs previos (sin re-render)
    previousOrderIdsRef.current = currentOrderIds
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
        highlightTimeoutRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredOrders.length, audioEnabled])

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-orange-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600" />
        <p className="mt-4 text-orange-600 font-semibold">Cargando órdenes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-bold text-xl">Error al cargar órdenes</p>
          <p className="text-gray-500 mt-2">Por favor, recarga la página</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Audio de notificación */}
      <audio 
        ref={audioRef} 
        preload="auto"
        src="/sounds/notification.mp3"
      />

      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Botón Toggle de Audio (Arriba a la derecha) */}
          <button
            onClick={toggleAudio}
            className={`
              fixed top-4 right-4 z-50 cursor-pointer
              p-4 rounded-full shadow-2xl 
              transition-all duration-300 
              hover:scale-110 active:scale-95
              ${audioEnabled 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600 animate-pulse'
              }
            `}
            title={audioEnabled ? 'Deshabilitar sonido' : 'Habilitar sonido'}
          >
            {audioEnabled ? (
              <Volume2 className="text-white" size={16} strokeWidth={2.5} />
            ) : (
              <VolumeX className="text-white" size={16} strokeWidth={2.5} />
            )}
          </button>

          {/* Header */}
          <div className="flex flex-col justify-center items-center">
            <Heading>Órdenes Listas</Heading>

            {/* Filtro de fechas */}
            <div className="mt-6 mb-4">
              <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-md">
                <Calendar size={20} className="text-orange-500 ml-2" />
                <div className="flex gap-2">
                  {getDateOptions().map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedDate(option.value)}
                      className={`
                        cursor-pointer px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                        ${selectedDate === option.value
                          ? 'bg-orange-500 text-white shadow-md transform scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      <span className="block leading-tight">
                        {option.label}
                      </span>
                      <span className={`
                        block text-xs leading-tight
                        ${selectedDate === option.value ? 'text-orange-100' : 'text-gray-500'}
                      `}>
                        {option.display}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden 2xl:block fixed bottom-0 right-6">
              <Logo />
            </div>
          </div>

          {/* Grid de órdenes */}
          {filteredOrders.length ? (
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex -ml-6 w-auto mt-4"
              columnClassName="pl-6 bg-clip-padding"
            >
              {filteredOrders.map((order) => (
                <div key={order.id} className="mb-6">
                  <LatestOrderItem 
                    order={order}
                    isNew={newOrderIds.has(order.id)}
                  />
                </div>
              ))}
            </Masonry>
          ) : (
            <div className="text-center mt-20">
              <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-xl text-gray-600 font-semibold">No hay órdenes pendientes</p>
                <p className="text-sm text-gray-400 mt-2">No hay órdenes en esta fecha</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}