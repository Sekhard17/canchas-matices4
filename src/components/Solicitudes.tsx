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
import { Clock, CalendarX, UserPlus, MessageSquare, Send, History } from 'lucide-react'
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

export default function SolicitudesUsuario() {
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

  const solicitudInfo = {
    cambioHora: {
      titulo: "Solicitud de Cambio de Hora",
      descripcion: "Solicita un cambio en la hora de tu reserva.",
      icono: <Clock className="w-6 h-6" />,
    },
    anulacion: {
      titulo: "Solicitud de Anulación de Hora",
      descripcion: "Solicita la anulación de tu reserva.",
      icono: <CalendarX className="w-6 h-6" />,
    },
    invitado: {
      titulo: "Solicitud de Invitado Adicional",
      descripcion: "Solicita agregar un invitado adicional a tu reserva.",
      icono: <UserPlus className="w-6 h-6" />,
    },
    otro: {
      titulo: "Otra Solicitud",
      descripcion: "Realiza cualquier otra solicitud relacionada con tu reserva.",
      icono: <MessageSquare className="w-6 h-6" />,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white/90 backdrop-blur-md shadow-xl rounded-xl">
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-bold text-center">Solicitudes de Usuario</CardTitle>
            <CardDescription className="text-center">
              Gestiona tus reservas y realiza solicitudes especiales
            </CardDescription>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="absolute top-2 right-2 text-sm px-2 py-1">
                  <History className="w-4 h-4 mr-1" />
                  Historial
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Historial de Solicitudes</DialogTitle>
                  <DialogDescription>
                    Aquí puedes ver el estado de tus solicitudes anteriores.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {historialEjemplo.map((solicitud) => (
                    <div key={solicitud.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                      <p className="font-bold">{solicitudInfo[solicitud.tipo].titulo}</p>
                      <p>Fecha: {solicitud.fecha}</p>
                      <p>Estado: {solicitud.estado}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label>Tipo de Solicitud</Label>
                <RadioGroup
                  value={tipoSolicitud}
                  onValueChange={(value) => setTipoSolicitud(value as SolicitudType)}
                  className="grid grid-cols-2 gap-4"
                >
                  {Object.entries(solicitudInfo).map(([key, { titulo, icono }]) => (
                    <Label
                      key={key}
                      htmlFor={key}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        tipoSolicitud === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <RadioGroupItem value={key} id={key} className="sr-only" />
                      {icono}
                      <span className="mt-2 text-sm font-medium text-center">{titulo}</span>
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
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="reserva">Selecciona la reserva</Label>
                    <Select value={reservaSeleccionada} onValueChange={setReservaSeleccionada}>
                      <SelectTrigger>
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
                    <>
                      <div>
                        <Label htmlFor="nuevaFecha">Nueva Fecha</Label>
                        <Input
                          type="date"
                          id="nuevaFecha"
                          value={nuevaFecha}
                          onChange={(e) => setNuevaFecha(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="nuevaHora">Nueva Hora</Label>
                        <Input
                          type="time"
                          id="nuevaHora"
                          value={nuevaHora}
                          onChange={(e) => setNuevaHora(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="motivo">Motivo de la solicitud</Label>
                    <Textarea
                      id="motivo"
                      placeholder="Explica brevemente el motivo de tu solicitud"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              <Send className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
