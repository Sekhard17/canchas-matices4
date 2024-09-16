'use client'

import React, { useState, useEffect } from 'react'
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
  const [isHelpOpen, setIsHelpOpen] = useState(false)
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
          ? {...s, estado: aprobada ? 'aprobada' : 'rechazada'} 
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
          ? {...s, estado: 'rechazada'} 
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/40"
                    onClick={() => setIsHelpOpen(true)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ayuda e instrucciones</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="pendiente" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <TabsList className="bg-indigo-100 p-1 rounded-lg">
                <TabsTrigger value="pendiente" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Pendientes</TabsTrigger>
                <TabsTrigger value="aprobada" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Aprobadas</TabsTrigger>
                <TabsTrigger value="rechazada" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">Rechazadas</TabsTrigger>
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
                <Select value={filtro} onValueChange={(value) => setFiltro(value as SolicitudStatus)}>
                  <SelectTrigger className="w-[180px] rounded-full border-indigo-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendientes</SelectItem>
                    <SelectItem value="aprobada">Aprobadas</SelectItem>
                    <SelectItem value="rechazada">Rechazadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TabsContent value="pendiente">
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
            <TabsContent value="aprobada">
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <AnimatePresence>
                  {solicitudes.filter(s => s.estado === 'aprobada').map((solicitud) => (
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
            <TabsContent value="rechazada">
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <AnimatePresence>
                  {solicitudes.filter(s => s.estado === 'rechazada').map((solicitud) => (
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
      <HelpDialog isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

function SolicitudCard({ solicitud, onResponder, onAnular }: { solicitud: Solicitud, onResponder: (s: Solicitud)
 => void, onAnular: (id: string) => void }) {
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
            variant={solicitud.estado === 'pendiente' ? 'default' : 
                     solicitud.estado === 'aprobada' ? 'success' : 'destructive'}
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
  setNuevaFecha: (s: string) => void, 
  nuevaHora: string, 
  setNuevaHora: (s: string) => void, 
  nuevaCancha: string, 
  setNuevaCancha: (s: string) => void, 
  respuesta: string, 
  setRespuesta: (s: string) => void, 
  onSubmit: (aprobada: boolean) => void, 
  onAnular: (id: string) => void,
  onClose: () => void
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <div className={`p-2 rounded-full ${solicitudInfo[solicitud.tipo].bgColor} ${solicitudInfo[solicitud.tipo].color}`}>
              {solicitudInfo[solicitud.tipo].icono}
            </div>
            <span>{solicitudInfo[solicitud.tipo].titulo}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Responde a la solicitud de {solicitud.usuario}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {(solicitud.tipo === 'cambioHora' || solicitud.tipo === 'anulacion') && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nuevaFecha" className="text-right text-gray-700">
                  Nueva Fecha
                </Label>
                <Input
                  id="nuevaFecha"
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nuevaHora" className="text-right text-gray-700">
                  Nueva Hora
                </Label>
                <Select value={nuevaHora} onValueChange={setNuevaHora}>
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nuevaCancha" className="text-right text-gray-700">
                  Nueva Cancha
                </Label>
                <Select value={nuevaCancha} onValueChange={setNuevaCancha}>
                  <SelectTrigger className="col-span-3">
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
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="respuesta" className="text-right text-gray-700">
              Respuesta
            </Label>
            <Textarea
              id="respuesta"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onAnular(solicitud.id)
              onClose()
            }}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Anular Reserva
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSubmit(true)
              onClose()
            }}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Aprobar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HelpDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <span>Ayuda e Instrucciones</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Gestión de Solicitudes</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use las pestañas para filtrar solicitudes por estado: Pendientes, Aprobadas, o Rechazadas.</li>
              <li>Utilice la barra de búsqueda para encontrar solicitudes específicas por usuario, fecha o hora.</li>
              <li>Haga clic en "Responder" para aprobar, rechazar o anular una solicitud.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Responder a una Solicitud</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>En el diálogo de respuesta, puede modificar la fecha, hora y cancha si es necesario.</li>
              <li>Escriba una respuesta personalizada en el campo de texto.</li>
              <li>Elija "Aprobar" para aceptar la solicitud o "Anular Reserva" para rechazarla y cancelar la reserva.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Consejos Adicionales</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Las solicitudes están codificadas por colores según su tipo para una fácil identificación.</li>
              <li>Puede cerrar cualquier diálogo sin tomar acción haciendo clic fuera de él o en el botón "Cancelar".</li>
              <li>Asegúrese de revisar cuidadosamente los detalles antes de aprobar o anular una solicitud.</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Entendido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}