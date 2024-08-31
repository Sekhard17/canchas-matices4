'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast, Toaster } from 'react-hot-toast'
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, CameraIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'

interface Reserva {
  id: string
  estado: 'pendiente' | 'confirmada' | 'en_curso'
  cliente: {
    nombre: string
    email: string
    telefono: string
    avatar?: string
  }
  detalles: {
    fecha: Date
    cancha: string
    horas: { hora: string; precio: number }[]
    tieneBalon: boolean
  }
}

export default function ValidacionReserva() {
  const [darkMode, setDarkMode] = useState(false)
  const [escaneando, setEscaneando] = useState(false)
  const [reservaActual, setReservaActual] = useState<Reserva | null>(null)
  const [cargando, setCargando] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleScan = (result: string | null) => {
    if (result) {
      setEscaneando(false)
      setCargando(true)
      // Simulamos una llamada a la API para obtener los datos de la reserva
      setTimeout(() => {
        const reservaSimulada: Reserva = {
          id: result,
          estado: 'pendiente',
          cliente: {
            nombre: "Juan Pérez",
            email: "juan@example.com",
            telefono: "+56 9 1234 5678",
            avatar: "/placeholder.svg?height=100&width=100"
          },
          detalles: {
            fecha: new Date(),
            cancha: "C1F5",
            horas: [
              { hora: "10:00", precio: 10000 },
              { hora: "11:00", precio: 10000 }
            ],
            tieneBalon: true
          }
        }
        setReservaActual(reservaSimulada)
        setCargando(false)
      }, 1500)
    }
  }

  const handleError = (error: unknown) => {
    console.error(error)
    toast.error("Error al escanear el código QR")
  }

  const confirmarReserva = () => {
    if (reservaActual) {
      setCargando(true)
      // Simulamos una llamada a la API para actualizar el estado de la reserva
      setTimeout(() => {
        setReservaActual({
          ...reservaActual,
          estado: 'confirmada'
        })
        setCargando(false)
        toast.success("Reserva confirmada exitosamente")
      }, 1000)
    }
  }

  const reiniciar = () => {
    setReservaActual(null)
    setEscaneando(false)
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Validación de Reservas</h1>
          <Switch 
            checked={darkMode} 
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-blue-600"
          />
        </header>

        <AnimatePresence mode="wait">
          {!escaneando && !reservaActual && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-center">Escanear Código QR</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button 
                    size="lg" 
                    onClick={() => setEscaneando(true)}
                    className="text-lg"
                  >
                    <CameraIcon className="mr-2 h-6 w-6" />
                    Iniciar Escaneo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {escaneando && (
            <motion.div
              key="escaner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg overflow-hidden`}>
                <CardHeader>
                  <CardTitle className="text-center">Escanea el Código QR</CardTitle>
                </CardHeader>
                <CardContent>
                <QrScanner
                    onScan={(detectedCodes) => {
                        if (detectedCodes && detectedCodes.length > 0) {
                        handleScan(detectedCodes[0].rawValue);
                        }
                    }}
                    onError={handleError}
                    />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setEscaneando(false)}>
                    Cancelar Escaneo
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {reservaActual && (
            <motion.div
              key="reserva"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
                <CardHeader>
                  <CardTitle className="text-center">Detalles de la Reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={reservaActual.cliente.avatar} alt={reservaActual.cliente.nombre} />
                      <AvatarFallback>{reservaActual.cliente.nombre.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{reservaActual.cliente.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{reservaActual.cliente.email}</p>
                      <p className="text-sm text-muted-foreground">{reservaActual.cliente.telefono}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5 text-blue-500" />
                      <span>{format(reservaActual.detalles.fecha, 'dd MMMM yyyy', { locale: es })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-5 h-5 text-red-500" />
                      <span>{reservaActual.detalles.cancha}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-5 h-5 text-green-500" />
                      <span>{reservaActual.detalles.horas.map(h => h.hora).join(', ')}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estado:</span>
                    <Badge 
                      variant={reservaActual.estado === 'pendiente' ? 'outline' : 'default'}
                      className={reservaActual.estado === 'confirmada' ? 'bg-green-500' : ''}
                    >
                      {reservaActual.estado.charAt(0).toUpperCase() + reservaActual.estado.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="w-[48%]"
                    onClick={reiniciar}
                  >
                    <XCircleIcon className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button 
                    className="w-[48%]"
                    onClick={confirmarReserva}
                    disabled={reservaActual.estado !== 'pendiente' || cargando}
                  >
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    {reservaActual.estado === 'pendiente' ? 'Confirmar' : 'Confirmada'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {cargando && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <Toaster position="bottom-center" />
    </div>
  )
}
