//src/app/encargado/reservas/page.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell, Plus, Edit, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define los tipos de datos para las reservas
interface Reserva {
  id: number;
  nombre: string;
  inicio: string;
  fin: string;
  cancha: string;
  tipo: 'VIP' | 'Regular' | 'Torneo' | 'Club';
  rut: string;
}

const reservasEjemplo: Reserva[] = [
  { id: 1, nombre: 'Ricardo García', inicio: '15:00', fin: '16:00', cancha: 'Cancha C1', tipo: 'VIP', rut: '12345678-9' },
  { id: 2, nombre: 'Héctor Uribe', inicio: '16:00', fin: '17:00', cancha: 'Cancha C1', tipo: 'Regular', rut: '98765432-1' },
  { id: 3, nombre: 'Agustín Masuzzo', inicio: '18:00', fin: '19:00', cancha: 'Cancha C2', tipo: 'Torneo', rut: '11223344-5' },
  { id: 4, nombre: 'Sofía Beltrán', inicio: '19:00', fin: '20:00', cancha: 'Cancha C2', tipo: 'Club', rut: '55667788-9' },
  { id: 5, nombre: 'Lucas Matazzi', inicio: '20:00', fin: '21:00', cancha: 'Cancha C3', tipo: 'Regular', rut: '99887766-5' },
  { id: 6, nombre: 'Ignacio Sekhard', inicio: '21:00', fin: '22:00', cancha: 'Cancha C3', tipo: 'VIP', rut: '44332211-0' },
];

const canchas = ['Todas las canchas', 'Cancha C1', 'Cancha C2', 'Cancha C3', 'Cancha C4'];
const horas = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
const tipos = ['VIP', 'Regular', 'Torneo', 'Club'];

const colorPorTipo = {
  VIP: 'bg-purple-200 text-purple-800',
  Regular: 'bg-blue-200 text-blue-800',
  Torneo: 'bg-green-200 text-green-800',
  Club: 'bg-orange-200 text-orange-800',
};

export default function GestorReservasDeportivas() {
  const [fecha, setFecha] = useState<Date | undefined>(new Date());
  const [canchaSeleccionada, setCanchaSeleccionada] = useState('Todas las canchas');
  const [reservas, setReservas] = useState<Reserva[]>(reservasEjemplo);
  const [reservaEditando, setReservaEditando] = useState<Reserva | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [reservaEliminar, setReservaEliminar] = useState<Reserva | null>(null);

  const cambiarFecha = (nuevaFecha: Date | undefined) => {
    if (nuevaFecha) {
      setFecha(nuevaFecha);
    }
  };

  const filtrarReservas = () => {
    return canchaSeleccionada === 'Todas las canchas'
      ? reservas
      : reservas.filter(r => r.cancha === canchaSeleccionada);
  };

  const handleEditarReserva = (reserva: Reserva) => {
    setReservaEditando(reserva);
    setMostrarFormulario(true);
  };

  const handleEliminarReserva = (reserva: Reserva) => {
    setReservaEliminar(reserva);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminarReserva = () => {
    if (reservaEliminar) {
      setReservas(reservas.filter(r => r.id !== reservaEliminar.id));
      setMostrarConfirmacion(false);
      setReservaEliminar(null);
    }
  };

  const handleGuardarReserva = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nuevaReserva: Reserva = {
      id: reservaEditando ? reservaEditando.id : Date.now(),
      nombre: formData.get('nombre') as string,
      rut: formData.get('rut') as string,
      inicio: formData.get('inicio') as string,
      fin: formData.get('fin') as string,
      cancha: formData.get('cancha') as string,
      tipo: formData.get('tipo') as 'VIP' | 'Regular' | 'Torneo' | 'Club',
    };

    if (reservaEditando) {
      setReservas(reservas.map(r => r.id === reservaEditando.id ? nuevaReserva : r));
    } else {
      setReservas([...reservas, nuevaReserva]);
    }

    setMostrarFormulario(false);
    setReservaEditando(null);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Módulo de Reservas</h1>
          <p className="text-gray-600 mt-1">Optimiza y controla las reservas del sistema.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button onClick={() => setMostrarFormulario(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nueva Reserva
          </Button>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {fecha?.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fecha}
                onSelect={cambiarFecha}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Select value={canchaSeleccionada} onValueChange={setCanchaSeleccionada}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar cancha" />
          </SelectTrigger>
          <SelectContent>
            {canchas.map((cancha) => (
              <SelectItem key={cancha} value={cancha}>{cancha}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-20"></th>
              {canchas.slice(1).map((cancha) => (
                <th key={cancha} className="border p-2 min-w-[200px] font-semibold text-gray-700">{cancha}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora, index) => (
              <tr key={hora} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="border p-2 text-sm font-medium text-gray-700">{hora}</td>
                {canchas.slice(1).map((cancha) => (
                  <td key={`${cancha}-${hora}`} className="border p-2 relative h-16">
                    {filtrarReservas().filter(r => r.cancha === cancha && r.inicio === hora).map((reserva) => (
                      <div
                        key={reserva.id}
                        className={`absolute top-0 left-0 right-0 ${colorPorTipo[reserva.tipo]} p-2 rounded-md shadow-sm`}
                        style={{
                          height: `${(parseInt(reserva.fin) - parseInt(reserva.inicio)) * 64}px`,
                        }}
                      >
                        <div className="font-semibold">{reserva.nombre}</div>
                        <div className="text-xs mt-1">{reserva.inicio} - {reserva.fin}</div>
                        <div className="absolute top-1 right-1 flex space-x-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEditarReserva(reserva)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEliminarReserva(reserva)}>
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{reservaEditando ? 'Editar Reserva' : 'Nueva Reserva'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGuardarReserva}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input id="nombre" name="nombre" defaultValue={reservaEditando?.nombre} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rut" className="text-right">
                  RUT
                </Label>
                <Input id="rut" name="rut" defaultValue={reservaEditando?.rut} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inicio" className="text-right">
                  Hora Inicio
                </Label>
                <Select name="inicio" defaultValue={reservaEditando?.inicio || horas[0]}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar hora de inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {horas.map((hora) => (
                      <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fin" className="text-right">
                  Hora Fin
                </Label>
                <Select name="fin" defaultValue={reservaEditando?.fin || horas[1]}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar hora de fin" />
                  </SelectTrigger>
                  <SelectContent>
                    {horas.map((hora) => (
                      <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cancha" className="text-right">
                  Cancha
                </Label>
                <Select name="cancha" defaultValue={reservaEditando?.cancha || canchas[1]}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar cancha" />
                  </SelectTrigger>
                  <SelectContent>
                    {canchas.slice(1).map((cancha) => (
                      <SelectItem key={cancha} value={cancha}>{cancha}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Select name="tipo" defaultValue={reservaEditando?.tipo || tipos[0]}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={mostrarConfirmacion} onOpenChange={setMostrarConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarEliminarReserva}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
