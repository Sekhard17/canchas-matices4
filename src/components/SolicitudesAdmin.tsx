'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Clock, CalendarX, UserPlus, MessageSquare, CheckCircle, XCircle, ChevronRight, User, Calendar, MapPin, AlertCircle, Trash2, Search, Filter, MoreVertical, HelpCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type SolicitudType = 'cambioHora' | 'anulacion' | 'invitado' | 'otro'
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
  {
    id: '3',
    tipo: 'invitado',
    fechaSolicitud: '17-06-23 18:45',
    estado: 'pendiente',
    usuario: 'Carlos Rodríguez',
    reserva: { id: '3', fecha: '25-06-23', hora: '18:00', cancha: 'Cancha 3' },
    motivo: 'Quisiera traer a un amigo que está de visita.'
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
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  anulacion: {
    titulo: "Anulación",
    icono: <CalendarX className="w-5 h-5" />,
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  invitado: {
    titulo: "Invitado Adicional",
    icono: <UserPlus className="w-5 h-5" />,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  otro: {
    titulo: "Otra Solicitud",
    icono: <MessageSquare className="w-5 h-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
}

export default function AdminPanel() {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-indigo-200">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-2">Panel de Administración</CardTitle>
              <CardDescription className="text-indigo-100 text-lg">
                Gestiona las solicitudes de los usuarios de manera eficiente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="pendiente" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <TabsList className="bg-indigo-100 p-1 rounded-lg">
                <TabsTrigger value="pendiente" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600" onClick={() => setFiltro('pendiente')}>
                  Pendientes
                </TabsTrigger>
                <TabsTrigger value="aprobada" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600" onClick={() => setFiltro('aprobada')}>
                  Aprobadas
                </TabsTrigger>
                <TabsTrigger value="rechazada" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600" onClick={() => setFiltro('rechazada')}>
                  Rechazadas
                </TabsTrigger>
              </TabsList>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 rounded-full border-indigo-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
            <TabsContent value={filtro}>
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <AnimatePresence>
                  {filteredSolicitudes.map((solicitud) => (
                    <SolicitudCard
                      key={solicitud.id}
                      solicitud={solicitud}
                      onResponder={handleResponder}
                      onAnular={handleAnularReserva}
                    />
                  ))}
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
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${solicitudInfo[solicitud.tipo].bgColor} ${solicitudInfo[solicitud.tipo].color}`}>
              {solicitudInfo[solicitud.tipo].icono}
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              {solicitudInfo[solicitud.tipo].titulo}
            </CardTitle>
          </div>
          <Badge
            variant={
              solicitud.estado === 'pendiente'
                ? 'default'
                : solicitud.estado === 'aprobada'
                  ? 'default'
                  : 'destructive'
            }
            className="text-sm font-medium px-3 py-1 rounded-full"
          >
            {solicitud.estado}
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{solicitud.usuario}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{solicitud.fechaSolicitud}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{`${solicitud.reserva.fecha} ${solicitud.reserva.hora}`}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{solicitud.reserva.cancha}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{solicitud.motivo}</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {solicitud.estado === 'pendiente' && (
            <>
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50"
                onClick={() => onAnular(solicitud.id)}
              >
                Anular
              </Button>
              <Button
                className="bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-300"
                onClick={() => onResponder(solicitud)}
              >
                Responder
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Responder a la Solicitud</DialogTitle>
          <DialogDescription>
            Estás respondiendo a la solicitud de {solicitud.usuario}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Fecha</Label>
            <Input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
            />
          </div>
          <div>
            <Label>Hora</Label>
            <Select value={nuevaHora} onValueChange={setNuevaHora}>
              <SelectTrigger>
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
            <Label>Cancha</Label>
            <Select value={nuevaCancha} onValueChange={setNuevaCancha}>
              <SelectTrigger>
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
            <Label>Respuesta</Label>
            <Textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onSubmit(true)}>Aprobar</Button>
          <Button variant="destructive" onClick={() => onSubmit(false)}>
            Rechazar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
