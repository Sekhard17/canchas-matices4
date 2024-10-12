'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { motion, AnimatePresence } from 'framer-motion'
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
import { CalendarIcon, Clock, MapPin, User, LogOut, Settings, Menu, X, Activity, BarChart, TrendingUp, Bell, QrCode, PlusCircle, DollarSign, Sun, Moon, Home, MessageCircle, Calendar as CalendarIcon2, ChevronDown, Inbox, Search, Check } from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { es } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend)

const reservas = [
  { id: 1, fecha: '2024-08-20', hora: '15:00', cancha: 'C1F5', estado: 'Confirmada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva1' },
  { id: 2, fecha: '2024-08-22', hora: '18:30', cancha: 'C2F5', estado: 'Realizada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva2' },
  { id: 3, fecha: '2024-08-25', hora: '20:00', cancha: 'C3F7', estado: 'Anulada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva3' },
  { id: 4, fecha: '2024-08-28', hora: '16:45', cancha: 'C3F7', estado: 'Confirmada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva4' },
]

const notificaciones = [
  { id: 1, mensaje: 'Tu reserva para hoy ha sido confirmada', leida: false, fecha: '2024-08-20 10:30', icono: Check },
  { id: 2, mensaje: 'Nuevo horario disponible para reservas', leida: false, fecha: '2024-08-19 15:45', icono: Clock },
  { id: 3, mensaje: 'Recordatorio: Tu partido es en 1 hora', leida: true, fecha: '2024-08-18 18:00', icono: Bell },
]

const lineChartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Reservas por Mes',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      tension: 0.3
    }
  ]
}

const barChartData = {
  labels: ['6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22'],
  datasets: [
    {
      label: 'Reservas por Horario',
      data: [4, 6, 8, 5, 7, 9, 10, 3],
      backgroundColor: 'rgba(52, 211, 153, 0.6)',
      borderColor: 'rgb(52, 211, 153)',
      borderWidth: 1
    }
  ]
}

const daysChartData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Días Preferidos del Mes',
      data: [8, 12, 6, 9, 15, 20, 10],
      backgroundColor: 'rgba(251, 146, 60, 0.6)',
      borderColor: 'rgb(251, 146, 60)',
      borderWidth: 1
    }
  ]
}

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUser({ nombre: decoded.nombre, apellido: decoded.apellido, correo: decoded.correo })
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('token')
        router.replace('/error-404')
      }
    } else {
      router.replace('/error-404')
    }
  }, [router])

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

  const marcarNotificacionesComoLeidas = () => {
    // Lógica para marcar notificaciones como leídas
    console.log('Notificaciones marcadas como leídas')
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  const filteredReservas = reservas.filter(reserva => {
    if (!date) return true
    const reservaDate = new Date(reserva.fecha)
    return reservaDate.toDateString() === date.toDateString()
  })

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-4 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-sans">Dashboard</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                      {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
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
                  <Button variant="outline" size="icon" className="relative">
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
                      <DropdownMenuItem key={notificacion.id} className="flex items-start py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
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
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user ? `${user.nombre} ${user.apellido}` : '@username'} />
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

      {/* Sidebar */}
      <aside className={`fixed left-0  top-0 z-40 h-screen w-64 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center mb-5 font-semibold text-xl text-blue-600 dark:text-blue-400">
            <Activity className="mr-2 h-6 w-6" />
            <span>Matices</span>
          </div>
          <nav className="space-y-1">
            <div className="pb-2">
              <h2 className="mb-2 px-4  text-lg font-semibold tracking-tight">Principal</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Inicio
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Mis Reservas
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Canchas
                </Button>
              </div>
            </div>
            <div className="py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Aplicaciones</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CalendarIcon2 className="mr-2 h-4 w-4" />
                  Calendario
                </Button>
              </div>
            </div>
            <div className="py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Otros</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Inbox className="mr-2 h-4 w-4" />
                  Módulo de Solicitudes
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Más opciones
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>Opción 1</DropdownMenuItem>
                    <DropdownMenuItem>Opción 2</DropdownMenuItem>
                    <DropdownMenuItem>Opción 3</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-20 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total de Reservas", value: "24", icon: CalendarIcon, color: "bg-blue-500" },
            { title: "Saldo Gastado", value: "$480", icon: DollarSign, color: "bg-green-500" },
            { title: "Cancha Favorita", value: "C3F7", icon: MapPin, color: "bg-yellow-500" },
            { title: "Horario Preferido", value: "18:00", icon: Clock, color: "bg-pink-500" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <Card className={`${item.color} text-white overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75">{item.title}</p>
                    <p className="text-2xl font-bold mt-1">{item.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-white bg-opacity-30`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Días Preferidos del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Bar data={daysChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Mis Reservas
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      {date?.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full pr-4">
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
                        <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{reserva.cancha}</h3>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {reserva.fecha} - {reserva.hora}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                            <Badge variant={
                                  reserva.estado === 'Confirmada' ? 'default' :
                                  reserva.estado === 'Realizada' ? 'secondary' :
                                  'destructive'
                                }>
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
                                    <img src={reserva.qrCode} alt="Código QR de la reserva" className="w-48 h-48" />
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
                    <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">No has realizado reservas</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">¡Haz tu primera reserva y comienza a disfrutar!</p>
                    <Button className="mt-4" onClick={() => router.push('/reservar')}>Reservar Ahora</Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
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
        </div>
      </main>
    </div>
  )
}