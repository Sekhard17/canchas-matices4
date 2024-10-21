import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { decodeToken, CustomJwtPayload } from '@/utils/jwtUtils'

type Reserva = {
  id: number
  fecha: string
  hora_inicio: string
  estado: string
  id_cancha: number
  qr_code: string
  cancha: string
}

type Cancha = {
  nombre: string
}

type ReservaConCancha = Reserva & { canchas: Cancha }

type Pago = {
  monto: number
}

export function useDashboardData() {
  const [user, setUser] = useState<CustomJwtPayload | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date())

  // Obtener el token del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedUser = decodeToken(token)
      setUser(decodedUser)
    }
  }, [])

  const fetchReservas = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        id_reserva, 
        fecha, 
        hora_inicio, 
        estado, 
        id_cancha, 
        canchas (nombre)
      `)
      .eq('rut_usuario', user.id)

    if (error) {
      console.error('Error obteniendo reservas:', error)
      return
    }

    // Transformar la respuesta para asegurarnos de que cumple con el tipo
    const reservasConNombreCancha = (data as unknown as ReservaConCancha[]).map((reserva) => ({
      ...reserva,
      cancha: reserva.canchas?.nombre || 'Cancha no especificada',
    }))

    setReservas(reservasConNombreCancha)
  }, [user])

  const fetchPagos = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('pagos')
      .select('monto')
      .eq('rut_usuario', user.id)

    if (error) {
      console.error('Error obteniendo pagos:', error)
      return
    }
    setPagos(data || [])
  }, [user])

  useEffect(() => {
    if (user) {
      fetchReservas()
      fetchPagos()
    }
  }, [user, fetchReservas, fetchPagos])

  useEffect(() => {
    if (!user) return

    const reservasChannel = supabase
      .channel('public:reservas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservas', filter: `rut_usuario=eq.${user.id}` },
        (payload) => {
          console.log('Cambio en reservas:', payload)

          const nuevaReserva = payload.new as Reserva
          const reservaAntigua = payload.old as Reserva

          if (payload.eventType === 'INSERT' && nuevaReserva) {
            setReservas((prev) => [...prev, nuevaReserva])
          } else if (payload.eventType === 'UPDATE' && nuevaReserva) {
            setReservas((prev) =>
              prev.map((reserva) =>
                reserva.id === nuevaReserva.id ? nuevaReserva : reserva
              )
            )
          } else if (payload.eventType === 'DELETE' && reservaAntigua) {
            setReservas((prev) =>
              prev.filter((reserva) => reserva.id !== reservaAntigua.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(reservasChannel)
    }
  }, [user])

  const calcularEstadisticas = () => {
    const totalReservas = reservas.length
    const saldoGastado = pagos.reduce((acc, pago) => acc + pago.monto, 0)
    const canchaFavorita = calcularCanchaFavorita()
    const horarioPreferido = calcularHorarioPreferido()

    return { totalReservas, saldoGastado, canchaFavorita, horarioPreferido }
  }

  const calcularCanchaFavorita = () => {
    const nombresCanchas = reservas.map((reserva) => reserva.cancha)
  
    if (nombresCanchas.length === 0) return 'No disponible'
  
    const frecuencias = nombresCanchas.reduce<Record<string, number>>((acc, nombre) => {
      acc[nombre] = (acc[nombre] || 0) + 1
      return acc
    }, {})
  
    // Encontrar el nombre con mayor frecuencia
    return Object.keys(frecuencias).reduce((a, b) =>
      frecuencias[a] > frecuencias[b] ? a : b
    )
  }
  

  const calcularHorarioPreferido = () => {
    const horarios = reservas.map((reserva) =>
      reserva.hora_inicio.split(':').slice(0, 2).join(':')
    )
    if (horarios.length === 0) return 'No disponible'

    const frecuencias = horarios.reduce<Record<string, number>>((acc, hora) => {
      acc[hora] = (acc[hora] || 0) + 1
      return acc
    }, {})

    return Object.keys(frecuencias).reduce((a, b) =>
      frecuencias[a] > frecuencias[b] ? a : b
    )
  }

  const filtrarReservasPorFecha = useCallback(() => {
    return reservas.filter(
      (reserva) =>
        new Date(reserva.fecha).toDateString() === fechaSeleccionada?.toDateString()
    )
  }, [reservas, fechaSeleccionada])

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
