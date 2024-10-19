// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'
import { jwtDecode } from 'jwt-decode'

// Definimos los tipos explícitos
interface Cancha {
  id_cancha: number
  nombre: string
}

interface Pago {
  monto: number
}

interface Reserva {
  id_cancha: number
  fecha: string
  hora_inicio: string
  hora_fin: string
}

interface Usuario {
  nombre: string
  apellido: string
  correo: string
  id: string
}

export function useDashboard() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [saldoGastado, setSaldoGastado] = useState<number>(0)
  const [canchaFavorita, setCanchaFavorita] = useState<string>('No disponible')
  const [horarioFavorito, setHorarioFavorito] = useState<string>('')
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const cargarDatos = useCallback(async (RUT: string) => {
    try {
      setLoading(true)

      const [{ data: reservasData }, { data: pagosData }, { data: canchasData }] = await Promise.all([
        supabase.from('reservas').select('*').eq('rut_usuario', RUT),
        supabase.from('pagos').select('monto').eq('rut_usuario', RUT),
        supabase.from('canchas').select('id_cancha, nombre'),
      ])

      const reservas: Reserva[] = reservasData ?? []
      setReservas(reservas)

      const pagos: Pago[] = pagosData ?? []
      const totalSaldo = pagos.reduce((acc, pago) => acc + pago.monto, 0)
      setSaldoGastado(totalSaldo)

      const canchas: Cancha[] = canchasData ?? []
      const mapaCanchas = canchas.reduce((acc, cancha) => {
        acc[cancha.id_cancha] = cancha.nombre
        return acc
      }, {} as { [key: number]: string })

      const canchaMasReservada = Object.entries(
        reservas.reduce((acc: { [key: number]: number }, reserva) => {
          acc[reserva.id_cancha] = (acc[reserva.id_cancha] || 0) + 1
          return acc
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]

      setCanchaFavorita(mapaCanchas[Number(canchaMasReservada?.[0])] || 'No disponible')

      setLoading(false)
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode<Usuario>(token)
        setUser(decoded)
        cargarDatos(decoded.id)
      } catch (error) {
        console.error('Error decodificando token:', error)
        localStorage.removeItem('token')
        router.replace('/login')
      }
    } else {
      router.replace('/login')
    }
  }, [cargarDatos, router])

  return {
    reservas,
    saldoGastado,
    canchaFavorita,
    horarioFavorito,
    user,
    loading,
  }
}
