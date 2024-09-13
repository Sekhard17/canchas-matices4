'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Clock, CalendarX, UserPlus, MessageSquare, Send, History, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type SolicitudType = 'cambioHora' | 'anulacion' | 'invitado' | 'otro'

interface Reserva {
  id: string
  fecha: string
  hora: string
  cancha: string
}

interface HistorialSolicitud {
  id: string
  tipo: SolicitudType
  fecha: string
  estado: 'pendiente' | 'aprobada' | 'rechazada'
}

const reservasEjemplo: Reserva[] = [
  { id: '1', fecha: '2023-06-15', hora: '10:00 - 11:00', cancha: 'Cancha 1' },
  { id: '2', fecha: '2023-06-20', hora: '15:00 - 16:00', cancha: 'Cancha 2' },
  { id: '3', fecha: '2023-06-25', hora: '18:00 - 19:00', cancha: 'Cancha 3' },
]

const historialEjemplo: HistorialSolicitud[] = [
  { id: '1', tipo: 'cambioHora', fecha: '2023-06-10', estado: 'aprobada' },
  { id: '2', tipo: 'anulacion', fecha: '2023-06-12', estado: 'rechazada' },
  { id: '3', tipo: 'invitado', fecha: '2023-06-14', estado: 'pendiente' },
]

const solicitudInfo = {
  cambioHora: {
    titulo: "Cambio de Hora",
    descripcion: "Modifica el horario de tu reserva",
    icono: <Clock className="w-6 h-6" />,
  },
  anulacion: {
    titulo: "Anulación",
    descripcion: "Cancela tu reserva actual",
    icono: <CalendarX className="w-6 h-6" />,
  },
  invitado: {
    titulo: "Invitado Adicional",
    descripcion: "Agrega un invitado a tu reserva",
    icono: <UserPlus className="w-6 h-6" />,
  },
  otro: {
    titulo: "Otra Solicitud",
    descripcion: "Realiza cualquier otra petición",
    icono: <MessageSquare className="w-6 h-6" />,
  },
}

export default function Component() {
  const [tipoSolicitud, setTipoSolicitud] = useState<SolicitudType>('cambioHora')
  const [reservaSeleccionada, setReservaSeleccionada] = useState<string>('')
  const [nuevaFecha, setNuevaFecha] = useState<string>('')
  const [nuevaHora, setNuevaHora] = useState<string>('')
  const [motivo, setMotivo] = useState<string>('')
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Solicitud enviada",
      description: "Hemos recibido tu solicitud. Te contactaremos pronto.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 md:p-8">
          <CardTitle className="text-2xl md:text-3xl font-bold">Solicitudes de Usuario</CardTitle>
          <CardDescription className="text-indigo-100 mt-2">
            Gestiona tus reservas y realiza solicitudes especiales
          </CardDescription>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="absolute top-4 right-4 text-sm px-3 py-2">
                <History className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Historial</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Historial de Solicitudes</DialogTitle>
                <DialogDescription>
                  Revisa el estado de tus solicitudes anteriores.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                {historialEjemplo.map((solicitud) => (
                  <div key={solicitud.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{solicitudInfo[solicitud.tipo].titulo}</p>
                      <p className="text-sm text-gray-500">{solicitud.fecha}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      solicitud.estado === 'aprobada' ? 'bg-green-100 text-green-800' :
                      solicitud.estado === 'rechazada' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {solicitud.estado}
                    </span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Tipo de Solicitud</Label>
              <RadioGroup
                value={tipoSolicitud}
                onValueChange={(value) => setTipoSolicitud(value as SolicitudType)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {Object.entries(solicitudInfo).map(([key, { titulo, descripcion, icono }]) => (
                  <Label
                    key={key}
                    htmlFor={key}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      tipoSolicitud === key ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <RadioGroupItem value={key} id={key} className="sr-only" />
                    <div className="mr-4 flex-shrink-0">{icono}</div>
                    <div>
                      <p className="font-semibold">{titulo}</p>
                      <p className="text-sm text-gray-500 hidden sm:block">{descripcion}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tipoSolicitud}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="reserva" className="text-lg font-semibold">Selecciona la reserva</Label>
                  <Select value={reservaSeleccionada} onValueChange={setReservaSeleccionada}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona una reserva" />
                    </SelectTrigger>
                    <SelectContent>
                      {reservasEjemplo.map((reserva) => (
                        <SelectItem key={reserva.id} value={reserva.id}>
                          {reserva.fecha} - {reserva.hora} - {reserva.cancha}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {tipoSolicitud === 'cambioHora' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nuevaFecha" className="text-lg font-semibold">Nueva Fecha</Label>
                      <Input
                        type="date"
                        id="nuevaFecha"
                        value={nuevaFecha}
                        onChange={(e) => setNuevaFecha(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nuevaHora" className="text-lg font-semibold">Nueva Hora</Label>
                      <Input
                        type="time"
                        id="nuevaHora"
                        value={nuevaHora}
                        onChange={(e) => setNuevaHora(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="motivo" className="text-lg font-semibold">Motivo de la solicitud</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Explica brevemente el motivo de tu solicitud"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105" 
            onClick={handleSubmit}
          >
            <Send className="w-5 h-5 mr-2" />
            <span className="mr-2">Enviar Solicitud</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}