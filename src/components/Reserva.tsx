'use client'

import { useState, useEffect } from 'react'
import { format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarIcon, TrashIcon, UserIcon, MoonIcon, SunIcon, CheckCircleIcon, InfoIcon, ClockIcon, MapPinIcon, AlertTriangleIcon, ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

const horariosDisponibles = [
  { hora: '08:00', dia: '2024-08-24', disponible: true, cancha: 'C1F5', precio: 10000 },
  { hora: '09:00', dia: '2024-08-24', disponible: true, cancha: 'C1F5', precio: 10000 },
  { hora: '10:00', dia: '2024-08-24', disponible: false, cancha: 'C2F5', precio: 12000 },
  { hora: '11:00', dia: '2024-08-24', disponible: true, cancha: 'C3F7', precio: 15000 },
  { hora: '12:00', dia: '2024-08-24', disponible: true, cancha: 'C1F5', precio: 10000 },
  { hora: '13:00', dia: '2024-08-25', disponible: true, cancha: 'C2F5', precio: 12000 },
  { hora: '14:00', dia: '2024-08-25', disponible: true, cancha: 'C3F7', precio: 15000 },
  { hora: '15:00', dia: '2024-08-25', disponible: true, cancha: 'C4F7', precio: 15000 },
]

const canchas = ['Todas', 'C1F5', 'C2F5', 'C3F7', 'C4F7']

export default function Component() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedHoras, setSelectedHoras] = useState<typeof horariosDisponibles>([])
  const [formData, setFormData] = useState({ tieneBalon: false })
  const [darkMode, setDarkMode] = useState(false)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [selectedCancha, setSelectedCancha] = useState(canchas[0])
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showUnavailable, setShowUnavailable] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const handleHoraClick = (slot: (typeof horariosDisponibles)[number]) => {
    setSelectedHoras((prev) => {
      const isAlreadySelected = prev.some((item) => item.hora === slot.hora && item.dia === slot.dia)
      if (isAlreadySelected) {
        return prev.filter((item) => !(item.hora === slot.hora && item.dia === slot.dia))
      } else {
        return [...prev, slot]
      }
    })
  }

  const handleDeleteHora = (index: number) => {
    setSelectedHoras((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFormSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log('Reserva confirmada:', { ...formData, selectedHoras })
      setModalOpen(false)
      setSelectedHoras([])
      toast.success('¡Reserva confirmada con éxito!')
      setStep(1)
    }, 2000)
  }

  const availableHours = horariosDisponibles.filter(
    (slot) => {
      const sameDay = isSameDay(new Date(slot.dia), selectedDate!)
      const matchCancha = selectedCancha === 'Todas' || slot.cancha === selectedCancha
      return sameDay && matchCancha && (showUnavailable || slot.disponible)
    }
  )

  const total = selectedHoras.reduce((acc, curr) => acc + curr.precio, 0)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Reserva tu Cancha
          </motion.h1>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setInfoModalOpen(true)}>
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Instrucciones de reserva</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Switch 
              checked={darkMode} 
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2" />
                    Selecciona una fecha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={es}
                    className={`rounded-md border ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} w-full`}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => setStep(2)}
                    disabled={!selectedDate}
                  >
                    Continuar
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg mb-4`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-5 w-5" />
                      Selecciona una cancha
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-sm"
                    >
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      Volver al calendario
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={setSelectedCancha} defaultValue={selectedCancha}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una cancha" />
                    </SelectTrigger>
                    <SelectContent>
                      {canchas.map((cancha) => (
                        <SelectItem key={cancha} value={cancha}>
                          {cancha}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center">
                      <ClockIcon className="mr-2 h-5 w-5" />
                      Horas Disponibles
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUnavailable(!showUnavailable)}
                      className="text-sm"
                    >
                      {showUnavailable ? (
                        <><EyeOffIcon className="mr-2 h-4 w-4" /> Ocultar no disponibles</>
                      ) : (
                        <><EyeIcon className="mr-2 h-4 w-4" /> Mostrar no disponibles</>
                      )}
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Selecciona las horas que deseas reservar para {format(selectedDate!, 'dd/MM/yyyy')}
                    {selectedCancha !== 'Todas' && ` en ${selectedCancha}`}
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full pr-4">
                    <div className="grid grid-cols-2 gap-2">
                      {availableHours.length > 0 ? (
                        availableHours.map((slot, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Button
                              variant={slot.disponible ? "outline" : "secondary"}
                              className={`w-full h-auto py-2 px-3 justify-between ${
                                selectedHoras.some(h => h.hora === slot.hora && h.dia === slot.dia) 
                                  ? 'ring-2 ring-primary bg-primary/10' 
                                  : ''
                              } ${slot.disponible ? '' : 'opacity-50 cursor-not-allowed'}`}
                              onClick={() => slot.disponible && handleHoraClick(slot)}
                              disabled={!slot.disponible}
                            >
                              <div className="flex flex-col items-start">
                                <span className="text-sm font-medium">{slot.hora}</span>
                                <span className="text-xs text-muted-foreground">{slot.cancha}</span>
                              </div>
                              <Badge variant={slot.disponible ? "secondary" : "outline"} className="ml-2">
                                ${slot.precio.toLocaleString()}
                              </Badge>
                            </Button>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4 col-span-2">No hay horas disponibles para esta fecha y cancha</p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm font-semibold">
                    Total: ${total.toLocaleString()}
                  </p>
                  <Button 
                    onClick={() => setModalOpen(true)}
                    disabled={selectedHoras.length === 0}
                  >
                    Reservar ({selectedHoras.length})
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className={`sm:max-w-[425px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CheckCircleIcon className="mr-2" />
                Confirmar Reserva
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarFallback><UserIcon /></AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Usuario: Juan Pérez</p>
                <p className="text-sm text-muted-foreground">Email: juan.perez@example.com</p>
              </div>
            </div>
            <ScrollArea className={`h-[200px] rounded-md border p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedHoras.map((slot, index) => (
                    <TableRow key={index}>
                      <TableCell>{slot.hora}</TableCell>
                      <TableCell>{slot.cancha}</TableCell>
                      <TableCell>${slot.precio.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteHora(index)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tieneBalon" 
                  checked={formData.tieneBalon}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, tieneBalon: checked as boolean }))}
                />
                <label
                  htmlFor="tieneBalon"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  ¿Tienes balón?
                </label>
              </div>
              <p className="text-lg font-semibold">Total: ${total.toLocaleString()}</p>
            </div>
            <DialogFooter>
              <Button onClick={handleFormSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? 'Procesando...' : 'Confirmar Reserva'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen}>
          <DialogContent className={`sm:max-w-[425px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <InfoIcon className="mr-2" />
                Instrucciones de Reserva
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Pasos para reservar:</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Selecciona una fecha en el calendario.</li>
                    <li>Elige una cancha específica o selecciona "Todas" para ver todas las opciones.</li>
                    <li>Selecciona las horas disponibles que desees reservar.</li>
                    <li>Haz clic en "Reservar" para revisar y confirmar tu selección.</li>
                    <li>Verifica los detalles de tu reserva en la ventana emergente.</li>
                    <li>Indica si traerás tu propio balón.</li>
                    <li>Haz clic en "Confirmar Reserva" para finalizar el proceso.</li>
                  </ol>
                </div>
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                  <h3 className="font-semibold flex items-center mb-2">
                    <AlertTriangleIcon className="mr-2 h-5 w-5" />
                    Política de Cancelación y Normas
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Las cancelaciones o cambios deben realizarse con al menos 2 horas de anticipación.</li>
                    <li>No se permiten zapatos de fútbol, solo zapatillas (la cancha es sintética).</li>
                    <li>Está prohibido el consumo de alcohol en las instalaciones.</li>
                    <li>Se requiere un mínimo de 6 jugadores por reserva.</li>
                    <li>El tiempo de juego comienza puntualmente a la hora reservada.</li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setInfoModalOpen(false)}>Entendido</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster position="bottom-center" />
    </div>
  )
}