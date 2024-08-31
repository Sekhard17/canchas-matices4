'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import QRCode from 'react-qr-code'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, MapPinIcon, ClockIcon, PhoneIcon, MailIcon, PrinterIcon, ShareIcon } from 'lucide-react'

interface ReservaExitosaProps {
  reservaId: string
  cliente: {
    nombre: string
    email: string
    telefono: string
    avatar?: string
  }
  reserva: {
    fecha: Date
    cancha: string
    horas: { hora: string; precio: number }[]
    tieneBalon: boolean
  }
}

const reservaData = {
  reservaId: "123456789",
  cliente: {
    nombre: "Carlos Rivas",
    email: "carlos@example.com",
    telefono: "+56912345678",
    avatar: "https://example.com/avatar.jpg",
  },
  reserva: {
    fecha: new Date(),
    cancha: "Cancha 1",
    horas: [
      { hora: "10:00 - 11:00", precio: 5000 },
      { hora: "11:00 - 12:00", precio: 5000 },
    ],
    tieneBalon: true,
  },
};

export default function ReservaExitosa() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const total = reservaData.reserva.horas.reduce((acc, curr) => acc + curr.precio, 0)

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">¡Reserva Confirmada!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <QRCode 
                  value={`https://ejemplo.com/reserva/${reservaData.reservaId}`}
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Presenta este código QR al llegar a las instalaciones
              </p>
              <Separator />
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={reservaData.cliente.avatar} alt={reservaData.cliente.nombre} />
                  <AvatarFallback>{reservaData.cliente.nombre.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{reservaData.cliente.nombre}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MailIcon className="w-4 h-4" />
                    <span>{reservaData.cliente.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{reservaData.cliente.telefono}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Detalles de la Reserva</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                    <span>{format(reservaData.reserva.fecha, 'dd MMMM yyyy', { locale: es })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-red-500" />
                    <span>{reservaData.reserva.cancha}</span>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Horas reservadas:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {reservaData.reserva.horas.map((hora, index) => (
                      <Badge key={index} variant="secondary" className="justify-between">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{hora.hora}</span>
                        <span>${hora.precio.toLocaleString()}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Balón:</span>
                  <span>{reservaData.reserva.tieneBalon ? 'Incluido' : 'No incluido'}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="w-[48%]">
                <PrinterIcon className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" className="w-[48%]">
                <ShareIcon className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
