'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { PuffLoader } from 'react-spinners'
import MotionNumber from 'motion-number'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, MapPin, User, LogOut, Settings, Menu, X, Activity, BarChart, TrendingUp, Bell, QrCode, PlusCircle, DollarSign, Sun, Moon, Home, MessageCircle, Calendar as CalendarIcon2, ChevronDown, Inbox, Search, Check, Zap, Trophy, Users, Repeat, Sparkles } from 'lucide-react'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#fff',
      borderWidth: 1,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        stepSize: 5,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  },
}

export default function EnhancedSportsDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [reservas, setReservas] = useState<any[]>([])
  const [totalReservas, setTotalReservas] = useState(0)
  const [saldoGastado, setSaldoGastado] = useState(0)
  const [canchaFavorita, setCanchaFavorita] = useState('')
  const [horarioFavorito, setHorarioFavorito] = useState('')
  const [lineChartData, setLineChartData] = useState<any>({ labels: [], datasets: [] })
  const [barChartData, setBarChartData] = useState<any>({ labels: [], datasets: [] })
  const [daysChartData, setDaysChartData] = useState<any>({ labels: [], datasets: [] })
  const [doughnutChartData, setDoughnutChartData] = useState<any>({ labels: [], datasets: [] })
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredReservas, setFilteredReservas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mapaCanchas, setMapaCanchas] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const procesarDatosGraficos = useCallback((reservas: any[], mapaCanchas: { [key: string]: string }) => {
    const reservasPorMes = Array(12).fill(0)
    const reservasPorCancha: { [key: number]: number } = {}
    const reservasPorHorario = Array(9).fill(0)
    const horarios = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00']

    reservas.forEach((reserva) => {
      const mes = new Date(reserva.fecha).getMonth()
      reservasPorMes[mes]++

      const canchaId = Number(reserva.id_cancha)
      if (!reservasPorCancha[canchaId]) reservasPorCancha[canchaId] = 0
      reservasPorCancha[canchaId]++

      const horaInicio = parseInt(reserva.hora_inicio.split(':')[0])
      const index = horaInicio - 16
      if (index >= 0 && index < reservasPorHorario.length) {
        reservasPorHorario[index]++
      }
    })

    const horarioFavoritoIndex = reservasPorHorario.indexOf(Math.max(...reservasPorHorario))
    setHorarioFavorito(horarios[horarioFavoritoIndex])

    setLineChartData({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: 'Reservas por Mes',
          data: reservasPorMes,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
          fill: true,
        },
      ],
    })

    setBarChartData({
      labels: horarios,
      datasets: [
        {
          label: 'Reservas por Horario',
          data: reservasPorHorario,
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
        },
      ],
    })

    const reservasPorDia = Array(7).fill(0)
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    reservas.forEach((reserva) => {
      const dia = new Date(reserva.fecha).getDay()
      reservasPorDia[(dia + 6) % 7]++
    })

    setDaysChartData({
      labels: dias,
      datasets: [
        {
          label: 'Días Preferidos del Mes',
          data: reservasPorDia,
          backgroundColor: 'rgba(249, 115, 22, 0.6)',
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 1,
        },
      ],
    })

    // Determinar la cancha favorita y preparar datos para el gráfico de donut
    const canchaFavoritaId = Object.keys(reservasPorCancha).reduce((a, b) => 
      reservasPorCancha[Number(a)] > reservasPorCancha[Number(b)] ? a : b
    )
    setCanchaFavorita(mapaCanchas[Number(canchaFavoritaId)] || 'No disponible')

    const doughnutData = Object.entries(reservasPorCancha).map(([id, count]) => ({
      name: mapaCanchas[id] || `Cancha ${id}`,
      value: count
    }))

    setDoughnutChartData({
      labels: doughnutData.map(item => item.name),
      datasets: [{
        data: doughnutData.map(item => item.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    })

  }, [])

  useEffect(() => {
    const obtenerDatosDashboard = async (RUT: string, shouldSetLoading = true) => {
      try {
        if (shouldSetLoading) setLoading(true)

        const { data: reservas, error: errorReservas } = await supabase
          .from('reservas')
          .select('*')
          .eq('rut_usuario', RUT)

        if (errorReservas) throw errorReservas

        setReservas(reservas)
        setTotalReservas(reservas.length)

        const { data: pagos, error: errorPagos } = await supabase
          .from('pagos')
          .select('monto')
          .eq('rut_usuario', RUT)

        if (errorPagos) throw errorPagos

        const saldoTotal = pagos.reduce((acc: number, pago: { monto: number }) => acc + pago.monto, 0)
        setSaldoGastado(saldoTotal)

        const { data: canchas, error: errorCanchas } = await supabase
          .from('canchas')
          .select('id_cancha, nombre')

        if (errorCanchas) throw errorCanchas

        const nuevoMapaCanchas: { [key: string]: string } = {}
        canchas.forEach((cancha: { id_cancha: number, nombre: string }) => {
          nuevoMapaCanchas[cancha.id_cancha.toString()] = cancha.nombre
        })
        setMapaCanchas(nuevoMapaCanchas)

        if (canchas && canchas.length > 0) {
          const reservasConNombre = reservas.map((reserva) => ({
            ...reserva,
            cancha: nuevoMapaCanchas[reserva.id_cancha.toString()] || 'Cancha desconocida',
          }))

          procesarDatosGraficos(reservasConNombre, nuevoMapaCanchas)
        }
      } catch (error) {
        console.error('Error obteniendo datos del dashboard:', error)
      } finally {
        if (shouldSetLoading) setLoading(false)
      }
    }

    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        if (decoded && decoded.id) {
          setUser({ nombre: decoded.nombre, apellido: decoded.apellido, correo: decoded.correo, RUT: decoded.id })
          obtenerDatosDashboard(decoded.id)
        } else {
          console.error('RUT no está presente en el token')
          router.replace('/error-404')
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('token')
        router.replace('/error-404')
      }
    } else {
      router.replace('/error-404')
    }

    const reservasSubscription = supabase
      .channel('reservas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, (payload) => {
        const token = localStorage.getItem('token')
        if (token) {
          const decoded: any = jwtDecode(token)
          obtenerDatosDashboard(decoded.id, false)
        }
      })
      .subscribe()

    const pagosSubscription = supabase
      .channel('pagos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pagos' }, (payload) => {
        const token = localStorage.getItem('token')
        if (token) {
          const decoded: any = jwtDecode(token)
          obtenerDatosDashboard(decoded.id, false)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(reservasSubscription)
      supabase.removeChannel(pagosSubscription)
    }
  }, [router, procesarDatosGraficos])

  useEffect(() => {
    const reservasFiltradas = reservas.filter((reserva) => {
      if (!date) return true
      const reservaDate = new Date(reserva.fecha)
      return reservaDate.toDateString() === date?.toDateString()
    })
    setFilteredReservas(reservasFiltradas)
  }, [date, reservas])

  const marcarNotificacionesComoLeidas = () => {
    setNotificaciones((prevNotificaciones) =>
      prevNotificaciones.map((notificacion: any) => ({
        ...notificacion,
        leida: true,
      }))
    )
  }

  

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-teal-400 to-green-500">
        <PuffLoader color="#ffffff" loading={loading} size={100} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Enhanced Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <span className="ml-2 text-2xl font-bold text-blue-600 dark:text-blue-400">SportSync</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                <Button variant="ghost">Dashboard</Button>
                <Button variant="ghost">Reservas</Button>
                <Button variant="ghost">Canchas</Button>
                <Button variant="ghost">Perfil</Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://avatar.iran.liara.run/public/18" alt={user ? `${user.nombre} ${user.apellido}` : '@username'} />
                      <AvatarFallback>{user && user.nombre ? user.nombre.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user ? `${user.nombre} ${user.apellido}` : 'Usuario Anónimo'}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push('/mi-perfil')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleDarkMode} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                      {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Enhanced Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg p-6 text-white"
          >
            <h1 className="text-3xl font-bold">¡Bienvenido de vuelta, {user?.nombre}!</h1>
            <p className="mt-2 text-lg">Aquí tienes un resumen de tu actividad deportiva reciente.</p>
          </motion.div>

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Reservas", value: totalReservas, icon: CalendarIcon, color: "from-blue-500 to-blue-600" },
              { title: "Saldo Gastado", value: saldoGastado, icon: DollarSign, color: "from-green-500 to-green-600", format: 'currency' },
              { title: "Cancha Favorita", value: canchaFavorita, icon: MapPin, color: "from-yellow-500 to-yellow-600" },
              { title: "Horario Favorito", value: horarioFavorito, icon: Clock, color: "from-purple-500 to-purple-600" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${item.color} text-white overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-white opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <MotionNumber
                      value={item.value}
                      format={item.format === 'currency' 
                        ? { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }
                        : { maximumFractionDigits: 0 }}
                      locales="es-CL"
                      className="text-2xl font-bold"
                    />
                    <p className="text-xs mt-1 opacity-75">+20% que el mes pasado</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Charts Section */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Tendencia de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Distribución por Cancha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Doughnut data={doughnutChartData} options={{
                    ...chartOptions,
                    cutout: '70%',
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        display: true,
                        position: 'right' as const,
                      },
                    },
                  }} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Horarios Preferidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Días Preferidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={daysChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Reservations Section */}
          <div className="mt-8">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
                    Mis Reservas
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        {date ? date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(day) => setDate(day)}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full pr-4">
                  {filteredReservas.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {filteredReservas.map((reserva, index) => (
                          <motion.div
                            key={reserva.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900 dark:to-teal-900 overflow-hidden hover:shadow-md transition-all duration-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="bg-blue-500 p-3 rounded-full">
                                      <Trophy className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{reserva.cancha}</h3>
                                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {reserva.fecha} - {reserva.hora}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant={
                                        reserva.estado === 'Confirmada'
                                          ? 'default'
                                          : reserva.estado === 'Realizada'
                                          ? 'secondary'
                                          : 'destructive'
                                      }
                                    >
                                      {reserva.estado}
                                    </Badge>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <QrCode className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                          <DialogTitle>Código QR de Reserva</DialogTitle>
                                          <DialogDescription>
                                            Muestra este código al llegar al complejo deportivo.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-center py-4">
                                          <Image src={reserva.qrCode} alt="Código QR de la reserva" width={192} height={192} />
                                        </div>
                                        <div className="text-center">
                                          <p className="font-semibold">{reserva.cancha}</p>
                                          <p>{reserva.fecha} - {reserva.hora}</p>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <CalendarIcon className="h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">No has realizado reservas</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">¡Haz tu primera reserva y comienza a disfrutar!</p>
                      <Button className="mt-4" onClick={() => router.push('/reservar')}>Reservar Ahora</Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}