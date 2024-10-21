import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { decodeToken, CustomJwtPayload } from '@/utils/jwtUtils'

type Reserva = {
  ID_Reserva: number
  Fecha: string
  Hora_inicio: string
  Estado: string
  ID_Cancha: number
}

type Pago = {
  Monto: number
}

export function useDashboardData() {
  const [user, setUser] = useState<CustomJwtPayload | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setUser(decodeToken(token))
  }, [])

  const fetchReservas = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('Reservas')
      .select('*')
      .eq('Rut_usuario', user.id)

    if (error) console.error('Error obteniendo reservas:', error)
    else setReservas(data || [])
  }, [user])

  const fetchPagos = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('Pagos')
      .select('Monto')
      .eq('Rut_usuario', user.id)

    if (error) console.error('Error obteniendo pagos:', error)
    else setPagos(data || [])
  }, [user])

  useEffect(() => {
    fetchReservas()
    fetchPagos()
  }, [fetchReservas, fetchPagos])

  // Implementación de tiempo real con canales de Supabase
  useEffect(() => {
    const reservasChannel = supabase
      .channel('reservas-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Reservas', filter: `Rut_usuario=eq.${user?.id}` },
        () => fetchReservas()
      )
      .subscribe()

    const pagosChannel = supabase
      .channel('pagos-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Pagos', filter: `Rut_usuario=eq.${user?.id}` },
        () => fetchPagos()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(reservasChannel)
      supabase.removeChannel(pagosChannel)
    }
  }, [user, fetchReservas, fetchPagos])

  const calcularEstadisticas = () => {
    const totalReservas = reservas.length
    const saldoGastado = pagos.reduce((acc, pago) => acc + pago.Monto, 0)
    const canchaFavorita = calcularCanchaFavorita()
    const horarioPreferido = calcularHorarioPreferido()

    return { totalReservas, saldoGastado, canchaFavorita, horarioPreferido }
  }

  const calcularCanchaFavorita = () => {
    const canchas = reservas.map((reserva) => reserva.ID_Cancha)
    const frecuencias = canchas.reduce((acc: any, cancha) => {
      acc[cancha] = (acc[cancha] || 0) + 1
      return acc
    }, {})

    return Object.keys(frecuencias).reduce((a, b) =>
      frecuencias[a] > frecuencias[b] ? a : b
    )
  }

  const calcularHorarioPreferido = () => {
    const horarios = reservas.map((reserva) => reserva.Hora_inicio)
    const frecuencias = horarios.reduce((acc: any, hora) => {
      acc[hora] = (acc[hora] || 0) + 1
      return acc
    }, {})

    return Object.keys(frecuencias).reduce((a, b) =>
      frecuencias[a] > frecuencias[b] ? a : b
    )
  }

  const filtrarReservasPorFecha = () => {
    return reservas.filter((reserva) =>
      new Date(reserva.Fecha).toDateString() === fechaSeleccionada?.toDateString()
    )
  }

  return {
    user,
    reservas,
    pagos,
    fechaSeleccionada,
    setFechaSeleccionada,
    filtrarReservasPorFecha,
    calcularEstadisticas,
  }
}
