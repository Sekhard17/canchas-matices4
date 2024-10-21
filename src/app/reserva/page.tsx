'use client'

import { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CalendarIcon,
  TrashIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  AlertTriangleIcon,
  Home,
  BarChart2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Link from 'next/link'

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

const canchas = [
  { id: 'C1F5', name: 'Cancha 1 (5 vs 5)', image: '/images/5v.jpg' },
  { id: 'C2F5', name: 'Cancha 2 (5 vs 5)', image: '/images/5v2.jpg' },
  { id: 'C3F7', name: 'Cancha 3 (7 vs 7)', image: '/images/7v.jpg' },
  { id: 'C4F7', name: 'Cancha 4 (7 vs 7)', image: '/images/7v2.jpg' },
]

const navItems = [
  { label: 'Inicio', href: '/', icon: <Home className="w-4 h-4" /> },
  { label: 'Dashboard', href: '/dashboard', icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'Reservas', href: '/reservas', icon: <CalendarIcon className="w-4 h-4" /> },
  { label: 'Mis Pagos', href: '/pagos', icon: <FileText className="w-4 h-4" /> },
  { label: 'Solicitudes', href: '/solicitudes', icon: <FileText className="w-4 h-4" /> },
]

export default function EnhancedDesktopReserva() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedHoras, setSelectedHoras] = useState<typeof horariosDisponibles>([])
  const [formData, setFormData] = useState({ tieneBalon: false })
  const [selectedCancha, setSelectedCancha] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)

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
      setSelectedCancha(null)
    }, 2000)
  }

  const availableHours = horariosDisponibles.filter((slot) => {
    const sameDay = isSameDay(new Date(slot.dia), selectedDate!)
    const matchCancha = slot.cancha === selectedCancha
    return sameDay && matchCancha && (showUnavailable || slot.disponible)
  })

  const total = selectedHoras.reduce((acc, curr) => acc + curr.precio, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-[#040038] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="text-white font-bold text-xl">
                  <span className="sr-only">Logo</span>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#040038]">
                    Logo
                  </div>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-gray-300 hover:bg-[#0600a0] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out flex items-center"
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/path/to/avatar.jpg" alt="Juan Pérez" />
                        <AvatarFallback>JP</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Juan Pérez</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          juan.perez@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                type="button"
                className="bg-[#040038] inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#0600a0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isNavOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isNavOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:bg-[#0600a0] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/path/to/avatar.jpg" alt="Juan Pérez" />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">Juan Pérez</div>
                  <div className="text-sm font-medium leading-none text-gray-400">juan.perez@example.com</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  href="/perfil"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#0600a0]"
                >
                  Mi Perfil
                </Link>
                <Link
                  href="/configuracion"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#0600a0]"
                >
                  Configuración
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#0600a0]"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <header className="text-center py-10 px-6 bg-primary">
              <motion.h1
                className="text-5xl font-bold text-primary-foreground mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Reserva tu Cancha
              </motion.h1>
              <p className="text-xl text-primary-foreground/80">Disfruta del mejor fútbol en nuestras instalaciones de primera</p>
            </header>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-white border-none shadow-lg col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <MapPinIcon className="mr-2 h-5 w-5" />
                      Selecciona una cancha
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid  grid-cols-2 gap-4">
                      {canchas.map((cancha) => (
                        <motion.div
                          key={cancha.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            selectedCancha === cancha.id ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => setSelectedCancha(cancha.id)}
                        >
                          <img src={cancha.image} alt={cancha.name} className="w-full h-24 object-cover" />
                          <div className="p-2 text-center">
                            <p className="text-sm font-medium">{cancha.name}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-lg col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      Selecciona una fecha
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={es}
                      className="rounded-md border bg-white w-full"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-lg col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-xl">
                      <div className="flex items-center">
                        <ClockIcon className="mr-2 h-5 w-5" />
                        Horas Disponibles
                      </div>
                    </CardTitle>
                    {selectedCancha && selectedDate && (
                      <p className="text-sm text-muted-foreground">
                        Para {format(selectedDate, 'dd/MM/yyyy')} en {selectedCancha}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full pr-4">
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
                                className={`
                                  w-full h-auto py-2 px-3 justify-between
                                  transition-all duration-200 ease-in-out
                                  ${selectedHoras.some(h => h.hora === slot.hora && h.dia === slot.dia)
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'hover:bg-secondary'
                                  }
                                  ${slot.disponible ? '' : 'opacity-50 cursor-not-allowed'}
                                `}
                                onClick={() => slot.disponible && handleHoraClick(slot)}
                                disabled={!slot.disponible}
                              >
                                <span className="text-sm font-medium">{slot.hora}</span>
                                <Badge 
                                  variant={selectedHoras.some(h => h.hora === slot.hora && h.dia === slot.dia) ? "outline" : "secondary"}
                                  className={`ml-2 ${selectedHoras.some(h => h.hora === slot.hora && h.dia === slot.dia) ? 'bg-primary-foreground text-primary' : ''}`}
                                >
                                  ${slot.precio.toLocaleString()}
                                </Badge>
                              </Button>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4 col-span-2">
                            {selectedCancha && selectedDate
                              ? "No hay horas disponibles para esta fecha y cancha"
                              : "Selecciona una cancha y una fecha para ver las horas disponibles"}
                          </p>
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
              </div>

              <Separator className="my-8" />

              <div className="p-6 rounded-lg bg-gray-100">
                <h3 className="font-semibold text-xl flex items-center mb-4">
                  <AlertTriangleIcon className="mr-2 h-6 w-6 text-yellow-500" />
                  Política de Cancelación y Normas
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Las cancelaciones o cambios deben realizarse con al menos 2 horas de anticipación.</li>
                  <li>No se permiten zapatos de fútbol, solo zapatillas (la cancha es sintética).</li>
                  <li>Está prohibido el consumo de alcohol en las instalaciones.</li>
                  <li>Se requiere un mínimo de 6 jugadores por reserva.</li>
                  <li>El tiempo de juego comienza puntualmente a la hora reservada.</li>
                </ul>
              </div>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-2xl">
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
                <ScrollArea className="h-[300px] rounded-md border p-4 bg-gray-100">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Cancha</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedHoras.map((slot, index) => (
                        <TableRow key={index}>
                          <TableCell>{format(new Date(slot.dia), 'dd/MM/yyyy')}</TableCell>
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
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}