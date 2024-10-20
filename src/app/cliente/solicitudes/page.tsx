//src/app/cliente/solicitudes/page.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Clock, CalendarX, UserPlus, MessageSquare, Send, History, ChevronRight, ChevronLeft, Calendar, Clock3, MapPin, Info, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const [currentStep, setCurrentStep] = useState(0)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Solicitud enviada",
      description: "Hemos recibido tu solicitud. Te contactaremos pronto.",
    })
    setCurrentStep(0)
    setTipoSolicitud('cambioHora')
    setReservaSeleccionada('')
    setNuevaFecha('')
    setNuevaHora('')
    setMotivo('')
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 2))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-500 p-4 sm:p-6 md:p-8 flex items-center justify-center font-sans">
      <Card className="w-full max-w-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border-t border-l border-white/20">
        <CardHeader className="relative bg-gradient-to-r from-teal-500 to-blue-600 text-white p-6">
          <CardTitle className="text-2xl md:text-3xl font-bold">Solicitudes</CardTitle>
          <CardDescription className="text-teal-100 mt-2">
            Gestiona tus reservas fácilmente
          </CardDescription>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20 transition-colors duration-300">
                <History className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Historial de Solicitudes</DialogTitle>
                <DialogDescription>
                  Revisa el estado de tus solicitudes anteriores.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="mt-4 h-[300px] pr-4">
                {historialEjemplo.map((solicitud) => (
                  <motion.div
                    key={solicitud.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {solicitudInfo[solicitud.tipo].icono}
                      <div>
                        <p className="font-semibold">{solicitudInfo[solicitud.tipo].titulo}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{solicitud.fecha}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      solicitud.estado === 'aprobada' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      solicitud.estado === 'rechazada' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {solicitud.estado}
                    </span>
                  </motion.div>
                ))}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label className="text-lg font-semibold mb-4 block">Tipo de Solicitud</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(solicitudInfo).map(([key, { titulo, descripcion, icono }]) => (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          tipoSolicitud === key ? 'ring-2 ring-teal-500 dark:ring-teal-400' : ''
                        }`}
                        onClick={() => setTipoSolicitud(key as SolicitudType)}
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="mb-2">{icono}</div>
                          <h3 className="font-semibold">{titulo}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{descripcion}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label className="text-lg font-semibold mb-4 block">Selecciona la reserva</Label>
                  <div className="space-y-4">
                    {reservasEjemplo.map((reserva) => (
                      <Card
                        key={reserva.id}
                        className={`cursor-pointer transition-all duration-300 ${
                          reservaSeleccionada === reserva.id ? 'ring-2 ring-teal-500 dark:ring-teal-400' : ''
                        }`}
                        onClick={() => setReservaSeleccionada(reserva.id)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Calendar className="w-5 h-5 text-teal-500" />
                            <div>
                              <p className="font-semibold">{reserva.fecha}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{reserva.hora}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{reserva.cancha}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {tipoSolicitud === 'cambioHora' && (
                    <>
                      <div>
                        <Label htmlFor="nuevaFecha" className="text-sm font-medium">Nueva Fecha</Label>
                        <Input
                          type="date"
                          id="nuevaFecha"
                          value={nuevaFecha}
                          onChange={(e) => setNuevaFecha(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nuevaHora" className="text-sm font-medium">Nueva Hora</Label>
                        <Input
                          type="time"
                          id="nuevaHora"
                          value={nuevaHora}
                          onChange={(e) => setNuevaHora(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="motivo" className="text-sm font-medium">Motivo de la solicitud</Label>
                    <Textarea
                      id="motivo"
                      placeholder="Explica brevemente el motivo de tu solicitud"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-800 p-6 flex justify-between">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
          {currentStep < 2 ? (
            <Button className="ml-auto" onClick={nextStep}>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105" 
                    onClick={handleSubmit}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Solicitud
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Haz clic para enviar tu solicitud</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}