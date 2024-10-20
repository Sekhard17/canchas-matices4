'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, MapPin, User, LogOut, Settings, Menu, X, Activity, BarChart, TrendingUp, Bell, QrCode, PlusCircle, DollarSign, Sun, Moon, Home, MessageCircle, Calendar as CalendarIcon2, ChevronDown, Inbox, Search, Check, Sparkles, Users, HelpCircle, ChevronRight } from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { PuffLoader } from 'react-spinners'
import MotionNumber from 'motion-number'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, ChartTooltip, Legend)

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
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: 'rgba(0, 0, 0, 0.5)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
}

const menuItems = [
  {
    category: "Principal",
    items: [
      { icon: Home, label: 'Inicio', href: '#' },
      { icon: CalendarIcon, label: 'Mis Reservas', href: '#' },
      { icon: MapPin, label: 'Canchas', href: '#' },
    ]
  },
  {
    category: "Gestión",
    items: [
      { icon: Users, label: 'Clientes', href: '#' },
      { icon: BarChart, label: 'Estadísticas', href: '#' },
      { icon: MessageCircle, label: 'Chat', href: '#' },
    ]
  },
  {
    category: "Sistema",
    items: [
      { icon: Inbox, label: 'Solicitudes', href: '#' },
      { icon: Settings, label: 'Configuración', href: '#' },
      { icon: HelpCircle, label: 'Ayuda', href: '#' },
    ]
  }
]

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [reservas, setReservas] = useState<any[]>([])
  const [totalReservas, setTotalReservas] = useState(0)
  const [saldoGastado, setSaldoGastado] = useState(0)
  const [canchaFavorita, setCanchaFavorita] = useState('')
  const [horarioFavorito, setHorarioFavorito] = useState('')
  const [lineChartData, setLineChartData] = useState<any>({
    labels: [],
    datasets: []
  })
  const [barChartData, setBarChartData] = useState<any>({
    labels: [],
    datasets: []
  })
  const [doughnutChartData, setDoughnutChartData] = useState<any>({
    labels: [],
    datasets: []
  })
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const [date, setDate] = useState<Date | null>(null)
  const [filteredReservas, setFilteredReservas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isMobile = useMediaQuery({ maxWidth: 768 })

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
        
        if (canchas && canchas.length > 0) {
          const mapaCanchas: { [key: string]: string } = {}
          canchas.forEach((cancha: { id_cancha: number, nombre: string }) => {
            mapaCanchas[cancha.id_cancha.toString()] = cancha.nombre
          })
          
          const reservasConNombre = reservas.map((reserva) => ({
            ...reserva,
            cancha: mapaCanchas[reserva.id_cancha.toString()] || 'Cancha desconocida',
          }))
          
          procesarDatosGraficos(reservasConNombre)
        } else {
          console.error('No se obtuvieron canchas')
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
  }, [router])

  const procesarDatosGraficos = (reservas: any[]) => {
    const reservasPorMes = Array(12).fill(0)
    const reservasPorCancha: { [key: string]: number } = {}
    const reservasPorHorario = Array(9).fill(0)
    const horarios = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00']
  
    reservas.forEach((reserva) => {
      const mes = new Date(reserva.fecha).getMonth()
      reservasPorMes[mes]++
  
      const cancha = reserva.cancha
      if (!reservasPorCancha[cancha]) reservasPorCancha[cancha] = 0
      reservasPorCancha[cancha]++
  
      const horaInicio = parseInt(reserva.hora_inicio.split(':')[0])
      const index = horaInicio - 16
      if (index >= 0 && index < reservasPorHorario.length) {
        reservasPorHorario[index]++
      }
    })
  
    const canchaFavoritaNombre = Object.keys(reservasPorCancha).reduce((a, b) => reservasPorCancha[a] > reservasPorCancha[b] ? a : b)
    setCanchaFavorita(canchaFavoritaNombre)
  
    const horarioFavoritoIndex = reservasPorHorario.indexOf(Math.max(...reservasPorHorario))
    setHorarioFavorito(horarios[horarioFavoritoIndex])
  
    setLineChartData({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: 'Reservas por Mes',
          data: reservasPorMes,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
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
          backgroundColor: 'rgba(52, 211, 153, 0.6)',
          borderColor: 'rgb(52, 211, 153)',
          borderWidth: 1,
        },
      ],
    })
  
    setDoughnutChartData({
      labels: Object.keys(reservasPorCancha),
      datasets: [
        {
          data: Object.values(reservasPorCancha),
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
        },
      ],
    })
  }

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <PuffLoader color="#ffffff" loading={loading} size={100} />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-4 md:hidden" 
                onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-sans">Matices Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleDarkMode}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
                      {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" /> : <Moon className="h-[1.2rem] w-[1.2rem] text-gray-700" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Notificaciones */}
              <DropdownMenu open={notificacionesAbiertas} onOpenChange={setNotificacionesAbiertas}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {notificaciones.some(n => !n.leida) && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 md:w-96">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notificaciones</span>
                    <Button variant="ghost" size="sm" onClick={marcarNotificacionesComoLeidas}>
                      Marcar como leídas
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px]">
                    {notificaciones.map((notificacion) => (
                      <DropdownMenuItem key={notificacion.id} className="flex items-start py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300">
                        <div className={`mr-3 mt-1 p-2 rounded-full ${notificacion.leida ? 'bg-gray-200 dark:bg-gray-600' : 'bg-blue-100 dark:bg-blue-900'}`}>
                          <notificacion.icono className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notificacion.mensaje}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notificacion.fecha}</p>
                        </div>
                        {!notificacion.leida && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Usuario */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://avatar.iran.liara.run/public/18" alt={user ? `${user.nombre} ${user.apellido}` : '@username'} />
                      <AvatarFallback>{user && user.nombre ? user.nombre.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user ? `${user.nombre} ${user.apellido}` : 'Usuario Anónimo'}</DropdownMenuLabel>
                  <p className="px-2 py-1 text-sm text-gray-500">{user ? user.correo : 'usuario@ejemplo.com'}</p>
                  <DropdownMenuSeparator />
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
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={isMobile ? 'closed' : 'open'}
          animate={isMobile ? (sidebarOpen ? 'open' : 'closed') : 'open'}
          variants={sidebarVariants}
          className="fixed left-0 top-0 bottom-0 w-80 bg-blue-900 text-white shadow-xl z-40 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-6 bg-blue-800">
              <h1 className="text-3xl font-bold tracking-tight">Matices</h1>
              <p className="text-lg text-blue-300 mt-2">Panel de Control</p>
            </div>
            <ScrollArea className="flex-grow">
              <nav className="p-4">
                {menuItems.map((category, categoryIndex) => (
                  <div key={category.category} className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-blue-300 px-4">{category.category}</h2>
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left mb-2 hover:bg-blue-800 hover:text-white transition-all duration-300 text-lg py-6 px-4 rounded-lg group"
                        >
                          <item.icon className="mr-4 h-6 w-6" />
                          <span className="flex-grow">{item.label}</span>
                          <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                      </motion.div>
                    ))}
                    {categoryIndex < menuItems.length - 1 && (
                      <Separator className="bg-blue-700 my-4" />
                    )}
                  </div>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-6 bg-blue-800">
              <p className="text-sm text-blue-300">© 2024 Matices. Todos los derechos reservados.</p>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <main className="md:ml-80 pt-20 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total de Reservas", value: totalReservas, icon: CalendarIcon, color: "bg-gradient-to-r from-blue-500 to-blue-600" },
            { title: "Saldo Gastado", value: saldoGastado, icon: DollarSign, color: "bg-gradient-to-r from-green-500 to-green-600" },
            { title: "Cancha Favorita", value: canchaFavorita, icon: MapPin, color: "bg-gradient-to-r from-yellow-500 to-yellow-600" },
            { title: "Hora Preferida", value: horarioFavorito, icon: Clock, color: "bg-gradient-to-r from-pink-500 to-pink-600" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <Card className={`${item.color} text-white overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75">{item.title}</p>
                    {index === 0 || index === 1 ? (
                      <MotionNumber
                        value={item.value}
                        format={index === 1 
                          ? { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }
                          : { maximumFractionDigits: 0 }}
                        locales="es-CL"
                        className="text-3xl font-bold mt-2"
                      />              
                    ) : (
                      <p className="text-3xl font-bold mt-2">{item.value}</p>
                    )}
                  </div>
                  <div className={`p-4 rounded-full bg-white bg-opacity-30`}>
                    <item.icon className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Tendencia de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Distribución de Canchas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Doughnut data={doughnutChartData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      display: true,
                      position: 'bottom' as const,
                    },
                  },
                }} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Mis Reservas
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    {date?.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }) || 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date || undefined}
                    onSelect={(day) => {
                      if (day) setDate(day);
                    }}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="proximas" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="proximas">Próximas Reservas</TabsTrigger>
                <TabsTrigger value="historial">Historial</TabsTrigger>
              </TabsList>
              <TabsContent value="proximas">
                <ScrollArea className="h-[400px] w-full pr-4">
                  {filteredReservas.length > 0 ? (
                    <AnimatePresence>
                      {filteredReservas.map((reserva, index) => (
                        <motion.div
                          key={reserva.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-4 last:mb-0"
                        >
                          <Card className="overflow-hidden hover:shadow-md transition-all duration-200 bg-gray-50 dark:bg-gray-800">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                  <MapPin className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{reserva.cancha}</h3>
                                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
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
                                      <Image src={reserva.qrCode} alt="Código QR de la reserva" className="w-48 h-48" />
                                    </div>
                                    <div className="text-center">
                                      <p className="font-semibold">{reserva.cancha}</p>
                                      <p>{reserva.fecha} - {reserva.hora}</p>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <CalendarIcon className="h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">No tienes reservas próximas</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">¡Haz tu primera reserva y comienza a disfrutar!</p>
                      <Button className="mt-4" onClick={() => router.push('/reservar')}>Reservar Ahora</Button>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="historial">
                <ScrollArea className="h-[400px] w-full pr-4">
                  {/* Aquí puedes mostrar el historial de reservas pasadas */}
                  <p className="text-center text-gray-500 dark:text-gray-400">Historial de reservas</p>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Horarios Favoritos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Estadísticas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Reservas Completadas</span>
                  <span className="text-lg font-bold">{totalReservas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Promedio de Gasto</span>
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(saldoGastado / totalReservas)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cancha Más Reservada</span>
                  <span className="text-lg font-bold">{canchaFavorita}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Horario Preferido</span>
                  <span className="text-lg font-bold">{horarioFavorito}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}