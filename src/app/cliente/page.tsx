'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  CalendarIcon, Clock, MapPin, User, LogOut, Settings, Search, Menu, X, 
  Activity, QrCode, PlusCircle, Sun, Moon, ChevronRight, BarChart, TrendingUp, 
  Users, DollarSign, Repeat, Zap, Bell, CreditCard, HelpCircle, LayoutDashboard 
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from "@/components/ui/calendar"
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { useDashboardData } from "@/hooks/useDashboardData"
import MotionNumber from 'motion-number'
import {useAuth} from '@/hooks/useAuth'
import { PuffLoader } from 'react-spinners'

// Registro de componentes necesarios para ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend)

export default function Component() {
  // Datos traídos del hook personalizado para manejar reservas y estadísticas
  const { user: Usuario, handleLogout, isLoading } = useAuth() 
  const { user, reservas, fechaSeleccionada, setFechaSeleccionada, filtrarReservasPorFecha, calcularEstadisticas } = useDashboardData()
  const nombreCompleto = Usuario ? `${Usuario.nombre} ${Usuario.apellido}` : 'Usuario'

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [darkMode, setDarkMode] = useState(false)
  const [filteredReservas, setFilteredReservas] = useState(reservas)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showFAB, setShowFAB] = useState(true)
  

  // Cálculo de estadísticas desde los datos obtenidos
  const { totalReservas, canchaFavorita, horarioPreferido, saldoGastado } = calcularEstadisticas()

  // Control de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Filtrar reservas cada vez que cambian las reservas o la fecha seleccionada
  useEffect(() => {
    setFilteredReservas(filtrarReservasPorFecha())
  }, [reservas, fechaSeleccionada, filtrarReservasPorFecha])
  

  // Modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  // Mapeo del estado de la reserva al tipo de badge correspondiente
  const mapEstadoToVariant = (estado: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (estado) {
      case 'Confirmada':
        return 'default'
      case 'Realizada':
        return 'secondary'
      case 'Anulada':
        return 'destructive'
      case 'Pendiente':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const prepareChartData = () => {
    const canchas = {} as Record<string, number>
    const horarios = {} as Record<string, number>
    const meses = {} as Record<string, number>

    reservas.forEach(reserva => {
      canchas[reserva.cancha] = (canchas[reserva.cancha] || 0) + 1
      const hora = reserva.hora_inicio.split(':')[0]
      horarios[hora] = (horarios[hora] || 0) + 1
      const mes = new Date(reserva.fecha).getMonth()
      meses[mes] = (meses[mes] || 0) + 1
    })

    return { canchas, horarios, meses }
  }

  const { canchas, horarios, meses } = prepareChartData()

  const barChartData = {
    labels: Object.keys(canchas),
    datasets: [{
      label: 'Reservas por Cancha',
      data: Object.values(canchas),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1
    }]
  }

  const horariosChartData = {
    labels: Array.from({ length: 9 }, (_, i) => `${16 + i}:00`), // Etiquetas de horas en formato HH:00
    datasets: [
      {
        label: 'Reservas por Horario',
        data: Array.from({ length: 9 }, (_, i) => horarios[(16 + i).toString()] || 0),
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        borderColor: 'rgb(52, 211, 153)',
        borderWidth: 1,
      },
    ],
  }
  

  const lineChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Reservas por Mes',
        data: Array(12).fill(0).map((_, i) => meses[i] || 0),
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.5)',
        tension: 0.3,
      },
    ],
  }
  

  // Configuración para los gráficos de ChartJS
  // Configuración para los gráficos de ChartJS
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: darkMode ? '#e5e7eb' : '#374151',
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: darkMode ? '#e5e7eb' : '#374151',
        callback: function (value: string | number, index: number) {
          const hora = 16 + index; // Ajustamos las horas a partir de 16:00
          return `${hora}:00`;
        },
      },
    },
    y: {
      beginAtZero: true,
      suggestedMin: 0,
      suggestedMax: 30, // Aumenta el rango máximo a 30
      ticks: {
        stepSize: 5, // Incremento de 5 unidades
        color: darkMode ? '#e5e7eb' : '#374151',
      },
      grid: {
        color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
};


  // Función de búsqueda de reservas
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = reservas.filter((reserva) =>
      reserva.id_cancha.toString().includes(query) ||
      reserva.fecha.includes(query) ||
      reserva.estado.includes(query)
    )
    setFilteredReservas(filtered)
  }

  // Control del acceso rápido y FAB
  const toggleQuickAccess = () => {
    setIsQuickAccessOpen(!isQuickAccessOpen)
    setShowFAB(isQuickAccessOpen)
  }

  // Mostrar el loader si todavía se está cargando la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <PuffLoader size={80} color="#4A90E2" />
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="flex-1">
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white font-sans">Dashboard de Cliente</h1>
              <div className="relative hidden lg:block">
                <Input
                  type="text"
                  placeholder="Buscar reservas..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
              {isMobile ? (
                <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Bell className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Notificaciones</DialogTitle>
                      <DialogDescription>
                        Tus notificaciones más recientes
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] w-full pr-4">
                      {[
                        { title: "Reserva confirmada", description: "Tu reserva para hoy a las 15:00 ha sido confirmada.", icon: <CalendarIcon className="h-4 w-4 text-green-500" />, date: "20-07-2024 10:30" },
                        { title: "Nuevo torneo", description: "Se ha anunciado un nuevo torneo de fútbol 5. ¡Inscríbete ahora!", icon: <Activity className="h-4 w-4 text-blue-500" />, date: "19-07-2024 14:15" },
                        { title: "Mantenimiento de cancha", description: "La Cancha 3 estará en mantenimiento el próximo lunes.", icon: <Settings className="h-4 w-4 text-yellow-500" />, date: "18-07-2024 09:00" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start p-2 w-full mb-4">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                              {item.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                    <Button variant="outline" className="w-full mt-4">Marcar todas como leídas</Button>
                  </DialogContent>
                </Dialog>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Bell className="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-[300px]">
                      {[
                        { title: "Reserva confirmada", description: "Tu reserva para hoy a las 15:00 ha sido confirmada.", icon: <CalendarIcon className="h-4 w-4 text-green-500"   />, date: "20-07-2024 10:30" },
                        { title: "Nuevo torneo", description: "Se ha anunciado un nuevo torneo de fútbol 5. ¡Inscríbete ahora!", icon: <Activity className="h-4 w-4 text-blue-500" />, date: "19-07-2024 14:15" },
                        { title: "Mantenimiento de cancha", description: "La Cancha 3 estará en mantenimiento el próximo lunes.", icon: <Settings className="h-4 w-4 text-yellow-500" />, date: "18-07-2024 09:00" },
                      ].map((item, index) => (
                        <DropdownMenuItem key={index} className="flex items-start p-2">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                              {item.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.date}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center">
                      <Button variant="ghost" className="w-full">Marcar todas como leídas</Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="{nombreCompleto}" />
                      <AvatarFallback>
              {Usuario ? `${Usuario.nombre[0]}${Usuario.apellido[0]}` : 'NN'}
            </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{nombreCompleto}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
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
              {!isMobile && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      Accesos Directos
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: "Mi Perfil", icon: <User className="h-5 w-5" />, color: "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200" },
                        { title: "Nueva Reserva", icon: <PlusCircle className="h-5 w-5" />, color: "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200" },
                        { title: "Mis Pagos", icon: <DollarSign className="h-5 w-5" />, color: "bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-200" },
                        { title: "Soporte", icon: <HelpCircle className="h-5 w-5" />, color: "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-200" },
                      ].map((item, index) => (
                        <Button key={index} variant="outline" className={`h-16 ${item.color} hover:bg-opacity-80 transition-all duration-300 hover:scale-105`}>
                          <div className="flex flex-col items-center">
                            {item.icon}
                            <span className="mt-1 text-xs">{item.title}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  {[
    {
      title: "Reservas Totales",
      value: totalReservas,
      isNumber: true, // Indicamos que es numérico
      icon: <CalendarIcon className="h-5 w-5 text-indigo-500" />,
      color: "bg-indigo-100 dark:bg-indigo-800/30"
    },
    {
      title: "Cancha Favorita",
      value: canchaFavorita,
      isNumber: false, // No es numérico
      icon: <MapPin className="h-5 w-5 text-emerald-500" />,
      color: "bg-emerald-100 dark:bg-emerald-800/30"
    },
    {
      title: "Horario Preferido",
      value: horarioPreferido,
      isNumber: false, // No es numérico
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-100 dark:bg-amber-800/30"
    },
    {
      title: "Saldo Gastado",
      value: saldoGastado,
      isNumber: true, // Indicamos que es numérico
      icon: <DollarSign className="h-5 w-5 text-pink-500" />,
      color: "bg-pink-100 dark:bg-pink-800/30"
    }
  ].map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`${item.color} border-none overflow-hidden group hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <CardTitle className="text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
              {item.title}
            </CardTitle>
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              {item.isNumber ? (
                <MotionNumber
                  value={item.value}
                  format={{
                    style: item.title === "Saldo Gastado" ? "currency" : "decimal",
                    currency: item.title === "Saldo Gastado" ? "CLP" : undefined,
                    maximumFractionDigits: 0
                  }}
                  locales="es-CL"
                />
              ) : (
                item.value || "No hay datos"
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-full p-2 transition-transform duration-300">
            {item.icon}
          </div>
        </CardContent>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  ))}
</div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  Mis Reservas
                  <Button variant="outline" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Reserva
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          if (newDate instanceof Date) {
                            setDate(newDate)
                            filtrarReservasPorFecha()
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="lg:hidden">
                        <Search className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Buscar Reservas</DialogTitle>
                        <DialogDescription>
                          Ingresa los detalles para buscar tus reservas
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="search-query">Búsqueda</Label>
                          <Input
                            id="search-query"
                            type="text"
                            placeholder="Buscar por cancha, fecha o estado..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="search-date">Fecha</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => {
                                  if (newDate instanceof Date) {
                                    setDate(newDate)
                                    filtrarReservasPorFecha()
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                        <AnimatePresence>
                      {filteredReservas.length > 0 ? (
                        filteredReservas.map((reserva, index) => (
                          <motion.div
                            key={reserva.id || `reserva-${index}`} // Respaldo con `index` si `id` no está presente
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="mb-4 last:mb-0"
                          >
        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
              {reserva.cancha || 'Cancha no especificada'}
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {reserva.fecha ? (
                format(new Date(reserva.fecha), 'PPp', { locale: es })
              ) : (
                'Fecha no disponible'
              )}
            </div>
          </div>
          <Badge variant={mapEstadoToVariant(reserva.estado || 'Pendiente')}>
            {reserva.estado || 'Pendiente'}
          </Badge>
        </div>
      </motion.div>
    ))
  ) : (
    <div className="text-center py-4">
      <p className="text-gray-500 dark:text-gray-400">No se encontraron reservas.</p>
    </div>
  )}
</AnimatePresence>

                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    onClick={() => setFilteredReservas(reservas)}
                    variant="outline"
                    size="sm"
                    className="hidden lg:inline-flex"
                  >
                    Mostrar Todas
                  </Button>
                </div>
                <ScrollArea className="h-[300px] w-full pr-4">
                <AnimatePresence>
  {filteredReservas.length > 0 ? (
    filteredReservas.map((reserva, index) => (
      <motion.div
        key={reserva.id || index} // Respaldo con `index` si `id` no es único o falta
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.1 }}
        className="mb-4 last:mb-0"
      >
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
                {reserva.cancha}
              </h3>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mt-1">
                <CalendarIcon className="mr-2 h-3 w-3" />
                {format(new Date(reserva.fecha), 'PPp', { locale: es })}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={mapEstadoToVariant(reserva.estado)}>
                {reserva.estado}
              </Badge>
              {reserva.qr_code && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-3 w-3" />
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
                      <Image
                        src={reserva.qr_code}
                        alt="Código QR de la reserva"
                        width={150}
                        height={150}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{reserva.cancha}</p>
                      <p>{format(new Date(reserva.fecha), 'PPp', { locale: es })}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))
  ) : (
    <div className="text-center py-8">
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        No existen reservas realizadas por ti.
      </p>
      <Button variant="default">
        <Activity className="mr-2 h-4 w-4" />
        Ir a Reservar
      </Button>
    </div>
  )}
</AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5" />
                  Reservas por Horario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar data={horariosChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Repeat className="mr-2 h-5 w-5" />
                  Reserva Frecuente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reservas.length > 0 ? (
                  <>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Basado en tus reservas anteriores, te sugerimos:</p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-semibold text-base mb-2">Cancha Principal</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Todos los martes a las 18:00</p>
                      <Button className="mt-4 w-full" variant="default" size="sm">
                        Reservar ahora
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No hay suficientes datos para sugerir una reserva frecuente.</p>
                    <Button variant="default" size="sm">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Hacer tu primera reserva
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="mr-2 h-5 w-5" />
                  Reservas por Cancha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Tendencia de Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showFAB && isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              variant="default"
              size="icon"
              className="rounded-full shadow-lg"
              onClick={toggleQuickAccess}
            >
              <Zap className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isQuickAccessOpen} onOpenChange={toggleQuickAccess}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accesos Directos</DialogTitle>
            <DialogDescription>
              Accede rápidamente a las funciones más utilizadas de la aplicación.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {[
              { title: "Mi Perfil", icon: <User className="h-6 w-6" />, color: "bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200" },
              { title: "Nueva Reserva", icon: <PlusCircle className="h-6 w-6" />, color: "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200" },
              { title: "Mis Pagos", icon: <DollarSign className="h-6 w-6" />, color: "bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-200" },
              { title: "Soporte", icon: <HelpCircle className="h-6 w-6" />, color: "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-200" },
              { title: "Cerrar Sesión", icon: <LogOut className="h-6 w-6" />, color: "bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-200" },
            ].map((item, index) => (
              <Button key={index} variant="outline" className={`h-24 ${item.color} hover:bg-opacity-80 transition-colors duration-200`}>
                <div className="flex flex-col items-center">
                  {item.icon}
                  <span className="mt-2 text-sm">{item.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}