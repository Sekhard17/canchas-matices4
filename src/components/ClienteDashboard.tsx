'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarIcon, Clock, MapPin, User, LogOut, Settings, Search, Menu, X, Activity, DollarSign, QrCode, PlusCircle, FileText, Sun, Moon, ChevronRight } from 'lucide-react'
import { es } from 'date-fns/locale'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend)

const reservas = [
  { id: 1, fecha: '2024-08-20', cancha: 'Cancha Principal', hora: '10:00 AM', estado: 'Confirmada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva1' },
  { id: 2, fecha: '2024-08-22', cancha: 'Cancha 2', hora: '12:00 PM', estado: 'Pendiente', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva2' },
  { id: 3, fecha: '2024-08-25', cancha: 'Cancha de Fútbol 7', hora: '3:00 PM', estado: 'Confirmada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva3' },
  { id: 4, fecha: '2024-08-28', cancha: 'Cancha Principal', hora: '5:00 PM', estado: 'Pendiente', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva4' },
  { id: 5, fecha: '2024-09-01', cancha: 'Cancha de Fútbol 7', hora: '11:00 AM', estado: 'Confirmada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva5' },
  { id: 6, fecha: '2024-09-03', cancha: 'Cancha 2', hora: '2:00 PM', estado: 'Pendiente', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva6' },
]

const lineChartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Reservas por Mes',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1
    }
  ]
}

const barChartData = {
  labels: ['Cancha Principal', 'Cancha 2', 'Cancha de Fútbol 7'],
  datasets: [
    {
      label: 'Horas Reservadas',
      data: [10, 5, 8],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
      ],
      borderWidth: 1
    }
  ]
}

export default function ClienteDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const mapEstadoToVariant = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return 'default'  // Cambiar a un valor permitido
      case 'Pendiente':
        return 'secondary'  // Cambiar a un valor permitido
      default:
        return 'default'
    }
  }
  

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
        },
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
    },
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-white dark:bg-gray-800 w-64 min-h-screen overflow-y-auto transition-all duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Mi Dashboard</h1>
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors duration-200">
                    <Activity className="h-5 w-5" />
                    <span>Resumen</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors duration-200">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Mis Reservas</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors duration-200">
                    <MapPin className="h-5 w-5" />
                    <span>Canchas</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-colors duration-200">
                    <DollarSign className="h-5 w-5" />
                    <span>Pagos</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@username" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
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
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Bienvenido, Juan</h2>
              <p className="text-gray-600 dark:text-gray-400">Aquí tienes un resumen de tus actividades recientes</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { title: "Reservas Activas", value: "3", icon: <CalendarIcon className="h-8 w-8 text-blue-500" />, color: "bg-blue-100 dark:bg-blue-800" },
                { title: "Horas Jugadas", value: "12", icon: <Clock className="h-8 w-8 text-green-500" />, color: "bg-green-100 dark:bg-green-800" },
                { title: "Canchas Favoritas", value: "2", icon: <MapPin className="h-8 w-8 text-yellow-500" />, color: "bg-yellow-100 dark:bg-yellow-800" },
                { title: "Puntos de Fidelidad", value: "150", icon: <Activity className="h-8 w-8 text-purple-500" />, color: "bg-purple-100 dark:bg-purple-800" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${item.color} border-none`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.title}</CardTitle>
                      {item.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center justify-between">
                    Próximas Reservas
                    <Button variant="outline" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nueva Reserva
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full pr-4">
                    {reservas.map((reserva, index) => (
                      <motion.div
                        key={reserva.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-4 last:mb-0"
                      >
                        <Card>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{reserva.cancha}</h3>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {reserva.fecha} - {reserva.hora}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={mapEstadoToVariant(reserva.estado)}>
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
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      locale={es}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas de Uso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="reservas">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="reservas">Reservas</TabsTrigger>
                        <TabsTrigger value="canchas">Canchas</TabsTrigger>
                      </TabsList>
                      <TabsContent value="reservas">
                        <div className="h-[200px]">
                          <Line data={lineChartData} options={chartOptions} />
                        </div>
                      </TabsContent>
                      <TabsContent value="canchas">
                        <div className="h-[200px]">
                          <Bar data={barChartData} options={chartOptions} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}