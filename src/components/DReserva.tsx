'use client';

import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  TrashIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
  CheckCircleIcon,
  InfoIcon,
  ClockIcon,
  MapPinIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const horariosDisponibles = [
  { hora: '08:00', dia: '2024-08-24', disponible: true, cancha: 'C1F5', precio: 10000 },
  { hora: '09:00', dia: '2024-08-24', disponible: true, cancha: 'C1F5', precio: 10000 },
  { hora: '10:00', dia: '2024-08-24', disponible: false, cancha: 'C2F5', precio: 12000 },
  { hora: '11:00', dia: '2024-08-24', disponible: true, cancha: 'C3F7', precio: 15000 },
  { hora: '12:00', dia: '2024-08-24', disponible: true, cancha: 'C1F5', precio: 10000 },
  { hora: '13:00', dia: '2024-08-25', disponible: true, cancha: 'C2F5', precio: 12000 },
  { hora: '14:00', dia: '2024-08-25', disponible: true, cancha: 'C3F7', precio: 15000 },
  { hora: '15:00', dia: '2024-08-25', disponible: true, cancha: 'C4F7', precio: 15000 },
];

const canchas = [
  { id: 'C1F5', name: 'Cancha 1 (5 vs 5)', image: '/public/images/5v.jpg' },
  { id: 'C2F5', name: 'Cancha 2 (5 vs 5)', image: '/public/images/5v2.jpg' },
  { id: 'C3F7', name: 'Cancha 3 (7 vs 7)', image: '/public/images/7v.jpg' },
  { id: 'C4F7', name: 'Cancha 4 (7 vs 7)', image: '/public/images/7v2.jpg' },
];

export default function EnhancedDesktopReserva() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedHoras, setSelectedHoras] = useState<typeof horariosDisponibles>([]);
  const [formData, setFormData] = useState({ tieneBalon: false });
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCancha, setSelectedCancha] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const handleHoraClick = (slot: (typeof horariosDisponibles)[number]) => {
    setSelectedHoras((prev) => {
      const isAlreadySelected = prev.some((item) => item.hora === slot.hora && item.dia === slot.dia);
      if (isAlreadySelected) {
        return prev.filter((item) => !(item.hora === slot.hora && item.dia === slot.dia));
      } else {
        return [...prev, slot];
      }
    });
  };

  const handleDeleteHora = (index: number) => {
    setSelectedHoras((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Reserva confirmada:', { ...formData, selectedHoras });
      setModalOpen(false);
      setSelectedHoras([]);
      toast.success('¡Reserva confirmada con éxito!');
      setSelectedCancha(null);
    }, 2000);
  };

  const availableHours = horariosDisponibles.filter((slot) => {
    const sameDay = isSameDay(new Date(slot.dia), selectedDate!);
    const matchCancha = slot.cancha === selectedCancha;
    return sameDay && matchCancha && (showUnavailable || slot.disponible);
  });

  const total = selectedHoras.reduce((acc, curr) => acc + curr.precio, 0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto bg-background rounded-xl shadow-lg overflow-hidden">
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
          <div className="flex justify-end mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Modo Oscuro</span>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={toggleDarkMode}
                      className="data-[state=checked]:bg-primary"
                    />
                    {darkMode ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cambiar modo de visualización</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg col-span-1`}>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <MapPinIcon className="mr-2 h-5 w-5" />
                  Selecciona una cancha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
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

            <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg col-span-1`}>
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
                  className={`rounded-md border ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} w-full`}
                />
              </CardContent>
            </Card>

            <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-none shadow-lg col-span-1`}>
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

          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
          <DialogContent className={`sm:max-w-[600px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
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
            <ScrollArea className={`h-[300px] rounded-md border p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
      <Toaster position="bottom-right" />
    </div>
  );
}