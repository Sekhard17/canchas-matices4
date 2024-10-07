'use client'
//Librerías
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {jwtDecode} from 'jwt-decode'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarIcon, Clock, MapPin, User, LogOut, Settings, Menu, X, Activity, QrCode, PlusCircle, Sun, Moon, BarChart, PieChart, TrendingUp } from 'lucide-react'
import { es } from 'date-fns/locale'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, ChartTooltip, Legend)

const reservas = [
  { id: 1, fecha: '2024-08-20', cancha: 'Cancha Principal', hora: '10:00 AM', estado: 'Confirmada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva1' },
  { id: 2, fecha: '2024-08-22', cancha: 'Cancha 2', hora: '12:00 PM', estado: 'Pendiente', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva2' },
  { id: 3, fecha: '2024-08-25', cancha: 'Cancha de Fútbol 7', hora: '3:00 PM', estado: 'Confirmada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva3' },
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
  labels: ['Cancha Principal', 'Cancha 2', 'Cancha de Fútbol 7'],
  datasets: [
    {
      label: 'Horas Reservadas',
      data: [10, 5, 8],
      backgroundColor: [
        'rgba(99, 102, 241, 0.6)',
        'rgba(52, 211, 153, 0.6)',
        'rgba(251, 191, 36, 0.6)',
      ],
      borderColor: [
        'rgb(99, 102, 241)',
        'rgb(52, 211, 153)',
        'rgb(251, 191, 36)',
      ],
      borderWidth: 1
    }
  ]
}

const pieChartData = {
  labels: ['Fútbol', 'Tenis', 'Básquetbol', 'Vóley'],
  datasets: [
    {
      data: [30, 25, 20, 15],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(52, 211, 153, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderColor: [
        'rgb(99, 102, 241)',
        'rgb(52, 211, 153)',
        'rgb(251, 191, 36)',
        'rgb(236, 72, 153)',
      ],
      borderWidth: 1,
    },
  ],
}

export default function Component() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ nombre: decoded.nombre, apellido: decoded.apellido, correo: decoded.correo })
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('token')
        router.push('/');
      }
    } else {
      router.push('/')
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
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };


  const mapEstadoToVariant = (estado: string) => {
    switch (estado) {
      case 'Confirmada':
        return 'default'
      case 'Pendiente':
        return 'secondary'
      default:
        return 'outline'
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
      <header className="bg-white dark:bg-gray-800 shadow-md">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-sans">Dashboard de Cliente</h1>
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
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user ? `${user.nombre} ${user.apellido}` : '@username'} />
              <AvatarFallback>{user && user.nombre ? user.nombre.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{user ? `${user.nombre} ${user.apellido}` : 'Usuario Anónimo'}</DropdownMenuLabel>
        <p className="px-4 py-2 text-sm text-gray-500">{user ? user.correo : 'usuario@ejemplo.com'}</p>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Tu Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>Tus Reservas</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      </DropdownMenu>
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  </div>
</header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Reservas Activas", value: "3", icon: <CalendarIcon className="h-8 w-8 text-indigo-500" />, color: "bg-indigo-100 dark:bg-indigo-800/30" },
            { title: "Horas Jugadas", value: "12", icon: <Clock className="h-8 w-8 text-emerald-500" />, color: "bg-emerald-100 dark:bg-emerald-800/30" },
            { title: "Canchas Favoritas", value: "2", icon: <MapPin className="h-8 w-8 text-amber-500" />, color: "bg-amber-100 dark:bg-amber-800/30" },
            { title: "Puntos de Fidelidad", value: "150", icon: <Activity className="h-8 w-8 text-pink-500" />, color: "bg-pink-100 dark:bg-pink-800/30" },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
              <ScrollArea className="h-[300px] w-full pr-4">
                <AnimatePresence>
                  {reservas.map((reserva, index) => (
                    <motion.div
                      key={reserva.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
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
              </ScrollArea>
            </CardContent>
          </Card>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                Reservas por Cancha
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Distribución por Deporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}