'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {jwtDecode} from 'jwt-decode'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js'
import { CalendarIcon, Clock, MapPin, DollarSign, X, BarChart, TrendingUp, Menu } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend)

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [reservas, setReservas] = useState<any[]>([])
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false)
  const [lineChartData, setLineChartData] = useState<any>({
    labels: [],
    datasets: []
  })
  const [barChartData, setBarChartData] = useState<any>({
    labels: [],
    datasets: []
  })
  const [daysChartData, setDaysChartData] = useState<any>({
    labels: [],
    datasets: []
  })
  const [totalReservas, setTotalReservas] = useState(0)
  const [saldoGastado, setSaldoGastado] = useState(0)
  const [canchaFavorita, setCanchaFavorita] = useState('')
  const [horarioFavorito, setHorarioFavorito] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUser({ nombre: decoded.nombre, apellido: decoded.apellido, correo: decoded.correo })
        
        // Llamar a las APIs para obtener reservas y notificaciones
        obtenerReservas(token)
        obtenerNotificaciones(token)

      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('token')
        router.replace('/error-404')
      }
    } else {
      router.replace('/error-404')
    }
  }, [router])

  useEffect(() => {
    if (reservas.length > 0) {
      procesarDatosGraficos(reservas)
      procesarDatosResumen(reservas)
    }
  }, [reservas])

  const obtenerReservas = async (token: string) => {
    try {
      const response = await fetch('https://canchas-back-4.onrender.com/api/reservas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Reservas obtenidas:', data);
        setReservas(data);  
      } else {
        console.error('Error al obtener las reservas:', response.statusText);
      }
    } catch (error) {
      console.error('Error de red al obtener las reservas:', error);
    }
  };
  
  const obtenerNotificaciones = async (token: string) => {
    try {
      const response = await fetch('https://canchas-back-4.onrender.com/api/notificaciones', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setNotificaciones(data)
      } else {
        console.error('Error al obtener las notificaciones:', response.statusText)
      }
    } catch (error) {
      console.error('Error de red al obtener las notificaciones:', error)
    }
  }

  const procesarDatosGraficos = (reservas: any[]) => {
    const reservasPorMes = Array(12).fill(0)
    reservas.forEach((reserva) => {
      const mes = new Date(reserva.Fecha).getMonth()
      reservasPorMes[mes]++
    })
    setLineChartData({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: 'Reservas por Mes',
          data: reservasPorMes,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.3
        }
      ]
    })

    const reservasPorHorario = Array(8).fill(0)
    const horarios = ['6-8', '8-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22']
    reservas.forEach((reserva) => {
      if (reserva.hora_inicio && typeof reserva.hora_inicio === 'string') {
        const horaInicio = parseInt(reserva.hora_inicio.split(':')[0]);  
        const index = Math.floor((horaInicio - 6) / 2);
        if (index >= 0 && index < reservasPorHorario.length) {
          reservasPorHorario[index]++
        }
      } else {
        console.error('hora_inicio inválida o indefinida en la reserva:', reserva);
      }
    });
    
    setBarChartData({
      labels: horarios,
      datasets: [
        {
          label: 'Reservas por Horario',
          data: reservasPorHorario,
          backgroundColor: 'rgba(52, 211, 153, 0.6)',
          borderColor: 'rgb(52, 211, 153)',
          borderWidth: 1
        }
      ]
    })

    const reservasPorDia = Array(7).fill(0)
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    reservas.forEach((reserva) => {
      const dia = new Date(reserva.Fecha).getDay()
      reservasPorDia[(dia + 6) % 7]++
    })
    setDaysChartData({
      labels: dias,
      datasets: [
        {
          label: 'Días Preferidos del Mes',
          data: reservasPorDia,
          backgroundColor: 'rgba(251, 146, 60, 0.6)',
          borderColor: 'rgb(251, 146, 60)',
          borderWidth: 1
        }
      ]
    })
  }

  const procesarDatosResumen = (reservas: any[]) => {
    setTotalReservas(reservas.length)
    const saldo = reservas.reduce((total, reserva) => total + reserva.Monto, 0)
    setSaldoGastado(saldo)

    const canchaCount: { [key: string]: number } = {}
    const horarioCount: { [key: string]: number } = {}

    reservas.forEach((reserva) => {
      if (canchaCount[reserva.ID_Cancha]) {
        canchaCount[reserva.ID_Cancha]++
      } else {
        canchaCount[reserva.ID_Cancha] = 1
      }

      const horario = `${reserva.Hora_inicio} - ${reserva.Hora_fin}`
      if (horarioCount[horario]) {
        horarioCount[horario]++
      } else {
        horarioCount[horario] = 1
      }
    })

    const canchaFavoritaID = Object.keys(canchaCount).reduce((a, b) => canchaCount[a] > canchaCount[b] ? a : b, '')
    
    // Obtener el nombre de la cancha favorita
    const obtenerCanchaFavorita = async (id: string) => {
      try {
        const response = await fetch(`https://canchas-back-4.onrender.com/api/canchas/${id}`);
        const cancha = await response.json();
        setCanchaFavorita(cancha.Nombre);
      } catch (error) {
        console.error('Error al obtener la cancha favorita:', error);
        setCanchaFavorita('Desconocida');
      }
    }
    obtenerCanchaFavorita(canchaFavoritaID);

    const horarioFavorito = Object.keys(horarioCount).reduce((a, b) => horarioCount[a] > horarioCount[b] ? a : b, '')
    setHorarioFavorito(horarioFavorito)
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
      title: {
        display: true,
        text: 'No hay datos, realiza una reserva para empezar a tener datos',
        color: '#666',
        font: {
          size: 16,
          weight: 'normal' as const,
          family: 'Arial',
        },
      },
    },
  }
  

  const filteredReservas = reservas.filter(reserva => {
    if (!date) return true
    const reservaDate = new Date(reserva.Fecha)
    return reservaDate.toDateString() === date.toDateString()
  })

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-20 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Total de Reservas", value: totalReservas, icon: CalendarIcon, color: "bg-blue-500" },
            { title: "Saldo Gastado", value: `$${saldoGastado}`, icon: DollarSign, color: "bg-green-500" },
            { title: "Cancha Favorita", value: canchaFavorita, icon: MapPin, color: "bg-yellow-500" },
            { title: "Horario Preferido", value: horarioFavorito, icon: Clock, color: "bg-pink-500" },
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
