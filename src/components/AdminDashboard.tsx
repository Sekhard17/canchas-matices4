'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'framer-motion'
import { Bar, Line } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PuffLoader } from 'react-spinners'
import { UserIcon, CalendarIcon, BellIcon, SettingsIcon, LogOutIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, DollarSignIcon, ActivityIcon } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl!, supabaseKey!)

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const horas = Array.from({ length: 9 }, (_, i) => i + 16) // 16:00 PM a 0:00 AM

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#000',
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#000',
      },
    },
    y: {
      ticks: {
        color: '#000',
      },
    },
  },
}

type EstadisticasDetalladas = {
  total: number
  confirmadas?: number
  pendientes?: number
  nuevos?: number
  recurrentes?: number
  reservas?: number
  otros?: number
  disponibles?: number
  enMantenimiento?: number
}

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [fechaActual, setFechaActual] = useState(new Date())
  const [vistaCalendario, setVistaCalendario] = useState('semana')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [estadisticasDetalladas, setEstadisticasDetalladas] = useState<EstadisticasDetalladas | null>(null)
  const [user, setUser] = useState<any>(null)
  const [reservas, setReservas] = useState<any[]>([])
  const [totalReservas, setTotalReservas] = useState(0)
  const [ingresos, setIngresos] = useState(0)
  const [canchasDisponibles, setCanchasDisponibles] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const obtenerDatosAdmin = async (RUT: string) => {
      try {
        setLoading(true)

        // Obtener reservas
        const { data: reservas, error: errorReservas } = await supabase
          .from('reservas')
          .select('*')

        if (errorReservas) throw errorReservas
        setReservas(reservas)
        setTotalReservas(reservas.length)

        // Obtener ingresos
        const { data: pagos, error: errorPagos } = await supabase
          .from('pagos')
          .select('monto')

        if (errorPagos) throw errorPagos
        const totalIngresos = pagos.reduce((acc: number, pago: { monto: number }) => acc + pago.monto, 0)
        setIngresos(totalIngresos)

        // Obtener canchas disponibles
        const { data: canchas, error: errorCanchas } = await supabase
          .from('canchas')
          .select('*')

        if (errorCanchas) throw errorCanchas
        const disponibles = canchas.filter((cancha: any) => cancha.estado === 'Disponible').length
        setCanchasDisponibles(disponibles)

      } catch (error) {
        console.error('Error obteniendo datos del administrador:', error)
      } finally {
        setLoading(false)
      }
    }

    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        if (decoded && decoded.rol === 'Administrador') {
          setUser({ nombre: decoded.nombre, correo: decoded.correo })
          obtenerDatosAdmin(decoded.id)
        } else {
          router.replace('/error-404')
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        router.replace('/error-404')
      }
    } else {
      router.replace('/error-404')
    }
  }, [router])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  const cambiarSemana = (direccion: number) => {
    const nuevaFecha = new Date(fechaActual)
    nuevaFecha.setDate(nuevaFecha.getDate() + direccion * 7)
    setFechaActual(nuevaFecha)
  }

  const cambiarMes = (direccion: number) => {
    const nuevaFecha = new Date(fechaActual)
    nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion)
    setFechaActual(nuevaFecha)
  }

  const obtenerSemana = () => {
    const primerDiaSemana = new Date(fechaActual)
    primerDiaSemana.setDate(fechaActual.getDate() - fechaActual.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(primerDiaSemana)
      dia.setDate(primerDiaSemana.getDate() + i)
      return dia
    })
  }

  const obtenerDiasMes = () => {
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0)
    const dias = []
    for (let d = new Date(primerDiaMes); d <= ultimoDiaMes; d.setDate(d.getDate() + 1)) {
      dias.push(new Date(d))
    }
    return dias
  }

  const obtenerReservasPorDia = (dia: Date) => {
    return reservas.filter(reserva => 
      reserva.fecha.getDate() === dia.getDate() &&
      reserva.fecha.getMonth() === dia.getMonth() &&
      reserva.fecha.getFullYear() === dia.getFullYear()
    )
  }

  const renderCalendarioSemana = () => {
    const semana = obtenerSemana()
    return (
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-1"></div>
        {semana.map((dia, index) => (
          <div key={index} className="text-center font-semibold">
            {diasSemana[dia.getDay()].slice(0, 3)}
            <br />
            {dia.getDate()}
          </div>
        ))}
        {horas.map((hora, indexHora) => (
          <React.Fragment key={indexHora}>
            <div className="text-right pr-2">{`${hora}:00`}</div>
            {semana.map((dia, indexDia) => {
              const reservasDia = obtenerReservasPorDia(dia)
              const reservaHora = reservasDia.find(r => r.fecha.getHours() === hora)
              return (
                <div key={`${indexHora}-${indexDia}`} className="border p-1 h-16">
                  {reservaHora && (
                    <div className={`text-xs p-1 rounded ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
                      {reservaHora.cancha}
                      <br />
                      {reservaHora.cliente}
                    </div>
                  )}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderCalendarioMes = () => {
    const diasMes = obtenerDiasMes()
    return (
      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map((dia, index) => (
          <div key={index} className="text-center font-semibold">
            {dia.slice(0, 3)}
          </div>
        ))}
        {diasMes.map((dia, index) => {
          const reservasDia = obtenerReservasPorDia(dia)
          return (
            <div key={index} className={`border p-2 h-24 ${dia.getMonth() !== fechaActual.getMonth() ? 'opacity-50' : ''}`}>
              <div className="text-right">{dia.getDate()}</div>
              {reservasDia.map((reserva, indexReserva) => (
                <div key={indexReserva} className={`text-xs p-1 mt-1 rounded ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
                  {reserva.cancha}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  const quickAccessData = [
    { title: "Reservas Hoy", value: `${totalReservas}`, icon: <CalendarIcon />, color: "bg-blue-500", detailedStats: { total: totalReservas } },
    { title: "Ingresos del Mes", value: `$${ingresos}`, icon: <DollarSignIcon />, color: "bg-yellow-500", detailedStats: { total: ingresos } },
    { title: "Canchas Disponibles", value: `${canchasDisponibles}/10`, icon: <ActivityIcon />, color: "bg-red-500", detailedStats: { total: canchasDisponibles, disponibles: canchasDisponibles } },
  ]

  const barData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Reservas Diarias',
        data: [12, 19, 15, 20, 25, 30, 22],
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.5)',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(59, 130, 246, 0.8)',
        borderWidth: 2,
      },
    ],
  }

  const lineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ingresos Mensuales',
        data: [3000, 4500, 4000, 5200, 5800, 6100],
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(59, 130, 246, 0.8)',
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  }

  const abrirModalEstadisticas = (stats: EstadisticasDetalladas) => {
    setEstadisticasDetalladas(stats)
    setModalAbierto(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="#3498db" loading={loading} size={100} />
      </div>
    )
  }


  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Bienvenido, Administrador</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Última conexión: Hoy, 10:30 AM</p>
          </motion.div>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <BellIcon className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 px-2 py-1">3</Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <h3 className="font-medium">Notificaciones</h3>
                    <p className="text-sm">Tienes 3 nuevas notificaciones</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-4">
                  <Button variant="ghost" className="justify-start">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Configuración
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Switch 
              checked={darkMode} 
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {quickAccessData.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg overflow-hidden cursor-pointer`} onClick={() => abrirModalEstadisticas(item.detailedStats)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                    </div>
                    <div className={`${item.color} p-3 rounded-full`}>
                      {item.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Calendario de Reservas</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={vistaCalendario} onValueChange={setVistaCalendario}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar vista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semana">Vista Semanal</SelectItem>
                      <SelectItem value="mes">Vista Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => vistaCalendario === 'semana' ? cambiarSemana(-1) : cambiarMes(-1)}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => vistaCalendario === 'semana' ? cambiarSemana(1) : cambiarMes(1)}>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                {vistaCalendario === 'semana' ? (
                  <h3 className="text-xl font-semibold">
                    Semana del {obtenerSemana()[0].getDate()} al {obtenerSemana()[6].getDate()} de {meses[fechaActual.getMonth()]} de {fechaActual.getFullYear()}
                  </h3>
                ) : (
                  <h3 className="text-xl font-semibold">
                    {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
                  </h3>
                )}
              </div>
              {vistaCalendario === 'semana' ? renderCalendarioSemana() : renderCalendarioMes()}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
            <CardHeader>
              <CardTitle>Reservas Semanales</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={barData} options={chartOptions} />
            </CardContent>
          </Card>
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
            <CardHeader>
              <CardTitle>Ingresos por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <Line data={lineData} options={chartOptions} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estadísticas Detalladas</DialogTitle>
          </DialogHeader>
          {estadisticasDetalladas && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(estadisticasDetalladas).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
