//src/app/admin/solicitudes/page.tsx
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Clock, CalendarX, CheckCircle, XCircle, ChevronRight, User, Calendar, MapPin, Search, Filter, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

type SolicitudType = 'cambioHora' | 'anulacion'
type SolicitudStatus = 'pendiente' | 'aprobada' | 'rechazada'

interface Solicitud {
  id: string
  tipo: SolicitudType
  fechaSolicitud: string
  estado: SolicitudStatus
  usuario: string
  reserva: {
    id: string
    fecha: string
    hora: string
    cancha: string
  }
  motivo: string
}

const solicitudesEjemplo: Solicitud[] = [
  {
    id: '1',
    tipo: 'cambioHora',
    fechaSolicitud: '15-06-23 14:30',
    estado: 'pendiente',
    usuario: 'Juan Pérez',
    reserva: { id: '1', fecha: '20-06-23', hora: '10:00', cancha: 'Cancha 1' },
    motivo: 'Tengo una reunión de trabajo a esa hora.'
  },
  {
    id: '2',
    tipo: 'anulacion',
    fechaSolicitud: '16-06-23 09:15',
    estado: 'pendiente',
    usuario: 'María García',
    reserva: { id: '2', fecha: '22-06-23', hora: '15:00', cancha: 'Cancha 2' },
    motivo: 'Me lesioné y no podré jugar.'
  },
]

const canchasDisponibles = ['Cancha 1', 'Cancha 2', 'Cancha 3']

const horasDisponibles = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]

const solicitudInfo = {
  cambioHora: {
    titulo: "Cambio de Hora",
    icono: <Clock className="w-5 h-5" />,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
  anulacion: {
    titulo: "Anulación",
    icono: <CalendarX className="w-5 h-5" />,
    color: "text-rose-500",
    bgColor: "bg-rose-100",
  },
}

export default function Component() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(solicitudesEjemplo)
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)
  const [nuevaFecha, setNuevaFecha] = useState<string>('')
  const [nuevaHora, setNuevaHora] = useState<string>('')
  const [nuevaCancha, setNuevaCancha] = useState<string>('')
  const [respuesta, setRespuesta] = useState<string>('')
  const [filtro, setFiltro] = useState<SolicitudStatus>('pendiente')
  const [busqueda, setBusqueda] = useState<string>('')

  const { toast } = useToast()

  const handleResponder = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud)
    setNuevaFecha(solicitud.reserva.fecha)
    setNuevaHora(solicitud.reserva.hora)
    setNuevaCancha(solicitud.reserva.cancha)
    setRespuesta('')
  }

  const handleSubmitRespuesta = (aprobada: boolean) => {
    if (selectedSolicitud) {
      const updatedSolicitudes = solicitudes.map(s =>
        s.id === selectedSolicitud.id
          ? { ...s, estado: (aprobada ? 'aprobada' : 'rechazada') as SolicitudStatus }
          : s
      )
      setSolicitudes(updatedSolicitudes)
      setSelectedSolicitud(null)
      toast({
        title: aprobada ? "Solicitud aprobada" : "Solicitud rechazada",
        description: "La respuesta ha sido enviada al usuario.",
        duration: 3000,
      })
    }
  }

  const handleAnularReserva = (solicitudId: string) => {
    const solicitudToAnular = solicitudes.find(s => s.id === solicitudId)
    if (solicitudToAnular) {
      const updatedSolicitudes = solicitudes.map(s =>
        s.id === solicitudId
          ? { ...s, estado: 'rechazada' as SolicitudStatus }
          : s
      )
      setSolicitudes(updatedSolicitudes)
      setSelectedSolicitud(null)
      toast({
        title: "Reserva anulada",
        description: `La reserva de ${solicitudToAnular.usuario} ha sido anulada con éxito.`,
        duration: 3000,
      })
    }
  }

  const filteredSolicitudes = solicitudes.filter(s =>
    s.estado === filtro &&
    (s.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.reserva.fecha.includes(busqueda) ||
      s.reserva.hora.includes(busqueda))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-sky-100 p-4 sm:p-6 md:p-8 font-sans">
      <Card className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden border border-teal-200">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-sky-500 text-white p-8">
          <CardTitle className="text-3xl md:text-4xl font-bold mb-2">Módulo Administrativo de Solicitudes</CardTitle>
          <CardDescription className="text-teal-100 text-lg">
            Gestiona las solicitudes de los usuarios de manera eficiente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="pendiente" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <TabsList className="bg-teal-100 p-1 rounded-full">
                <TabsTrigger value="pendiente" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-teal-600">
                  Pendientes
                </TabsTrigger>
                <TabsTrigger value="aprobada" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-teal-600">
                  Aprobadas
                </TabsTrigger>
                <TabsTrigger value="rechazada" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-teal-600">
                  Rechazadas
                </TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                <Input
                  type="text"
                  placeholder="Buscar solicitudes..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full border-teal-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <TabsContent value={filtro}>
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <AnimatePresence>
                  {filteredSolicitudes.length > 0 ? (
                    filteredSolicitudes.map((solicitud) => (
                      <SolicitudCard
                        key={solicitud.id}
                        solicitud={solicitud}
                        onResponder={handleResponder}
                        onAnular={handleAnularReserva}
                      />
                    ))
                  ) : (
                    <NoSolicitudesMessage status={filtro} />
                  )}
                </AnimatePresence>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {selectedSolicitud && (
        <ResponderDialog
          solicitud={selectedSolicitud}
          nuevaFecha={nuevaFecha}
          setNuevaFecha={setNuevaFecha}
          nuevaHora={nuevaHora}
          setNuevaHora={setNuevaHora}
          nuevaCancha={nuevaCancha}
          setNuevaCancha={setNuevaCancha}
          respuesta={respuesta}
          setRespuesta={setRespuesta}
          onSubmit={handleSubmitRespuesta}
          onAnular={handleAnularReserva}
          onClose={() => setSelectedSolicitud(null)}
        />
      )}
    </div>
  )
}

function SolicitudCard({ solicitud, onResponder, onAnular }: { solicitud: Solicitud, onResponder: (s: Solicitud) => void, onAnular: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-teal-100 hover:border-teal-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${solicitudInfo[solicitud.tipo].bgColor} ${solicitudInfo[solicitud.tipo].color}`}>
                {solicitudInfo[solicitud.tipo].icono}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {solicitudInfo[solicitud.tipo].titulo}
              </h3>
            </div>
            <Badge
              variant={
                solicitud.estado === 'pendiente'
                  ? 'secondary'
                  : solicitud.estado === 'aprobada'
                    ? 'default'
                    : 'destructive'
              }
              className="text-sm font-medium px-3 py-1 rounded-full"
            >
              {solicitud.estado}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-gray-600">{solicitud.usuario}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-gray-600">{solicitud.fechaSolicitud}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-gray-600">{`${solicitud.reserva.fecha} ${solicitud.reserva.hora}`}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-teal-500" />
              <span className="text-sm text-gray-600">{solicitud.reserva.cancha}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 bg-teal-50 p-3 rounded-md mb-4">{solicitud.motivo}</p>
          {solicitud.estado === 'pendiente' && (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="text-rose-500 border-rose-500 hover:bg-rose-50"
                onClick={() => onAnular(solicitud.id)}
              >
                Anular
              </Button>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-300"
                onClick={() => onResponder(solicitud)}
              >
                Responder
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function NoSolicitudesMessage({ status }: { status: SolicitudStatus }) {
  const messages = {
    pendiente: "No hay solicitudes pendientes",
    aprobada: "No hay solicitudes aprobadas",
    rechazada: "No hay solicitudes rechazadas"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <AlertCircle className="w-16 h-16 text-teal-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{messages[status]}</h3>
      <p className="text-gray-600">Las solicitudes aparecerán aquí cuando estén disponibles.</p>
    </motion.div>
  )
}

function ResponderDialog({
  solicitud,
  nuevaFecha,
  setNuevaFecha,
  nuevaHora,
  setNuevaHora,
  nuevaCancha,
  setNuevaCancha,
  respuesta,
  setRespuesta,
  onSubmit,
  onAnular,
  onClose
}: {
  solicitud: Solicitud,
  nuevaFecha: string,
  setNuevaFecha: React.Dispatch<React.SetStateAction<string>>,
  nuevaHora: string,
  setNuevaHora: React.Dispatch<React.SetStateAction<string>>,
  nuevaCancha: string,
  setNuevaCancha: React.Dispatch<React.SetStateAction<string>>,
  respuesta: string,
  setRespuesta: React.Dispatch<React.SetStateAction<string>>,
  onSubmit: (aprobada: boolean) => void,
  onAnular: (id: string) => void,
  onClose: () => void
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-700">Responder a la Solicitud</DialogTitle>
          <DialogDescription className="text-gray-600">
            Estás respondiendo a la solicitud de {solicitud.usuario}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="nueva-fecha" className="text-teal-700">Fecha</Label>
            <Input
              id="nueva-fecha"
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              className="mt-1 border-teal-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <Label htmlFor="nueva-hora" className="text-teal-700">Hora</Label>
            <Select value={nuevaHora} onValueChange={setNuevaHora}>
              <SelectTrigger id="nueva-hora" className="mt-1 border-teal-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                <SelectValue placeholder="Selecciona una hora" />
              </SelectTrigger>
              <SelectContent>
                {horasDisponibles.map((hora) => (
                  <SelectItem key={hora} value={hora}>
                    {hora}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="nueva-cancha" className="text-teal-700">Cancha</Label>
            <Select value={nuevaCancha} onValueChange={setNuevaCancha}>
              <SelectTrigger id="nueva-cancha" className="mt-1 border-teal-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                <SelectValue placeholder="Selecciona una cancha" />
              </SelectTrigger>
              <SelectContent>
                {canchasDisponibles.map((cancha) => (
                  <SelectItem key={cancha} value={cancha}>
                    {cancha}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="respuesta" className="text-teal-700">Respuesta</Label>
            <Textarea
              id="respuesta"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="mt-1 border-teal-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onSubmit(false)} className="mr-2">
            Rechazar
          </Button>
          <Button onClick={() => onSubmit(true)} className="bg-teal-500 hover:bg-teal-600 text-white">
            Aprobar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}