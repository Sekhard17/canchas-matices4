"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Edit, Plus, Trash2, User, Users, DollarSign, Calendar as CalendarIcon } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { format } from 'date-fns'

// Tipo para la estructura de un cliente
type Cliente = {
  id: string
  nombre: string
  email: string
  telefono: string
  fechaRegistro: string
  activo: boolean
}

// Tipo para la estructura de una reserva
type Reserva = {
  id: string
  clienteId: string
  fecha: string
  servicio: string
  monto: number
}

// Datos de ejemplo
const clientesIniciales: Cliente[] = [
  { id: '1', nombre: 'Ana García', email: 'ana@example.com', telefono: '123456789', fechaRegistro: '2023-01-15', activo: true },
  { id: '2', nombre: 'Luis Martínez', email: 'luis@example.com', telefono: '987654321', fechaRegistro: '2023-02-20', activo: true },
  { id: '3', nombre: 'Carmen Rodríguez', email: 'carmen@example.com', telefono: '456789123', fechaRegistro: '2023-03-10', activo: false },
]

const reservasIniciales: Reserva[] = [
  { id: '1', clienteId: '1', fecha: '2023-06-01', servicio: 'Corte de pelo', monto: 30 },
  { id: '2', clienteId: '1', fecha: '2023-06-15', servicio: 'Tinte', monto: 50 },
  { id: '3', clienteId: '2', fecha: '2023-06-02', servicio: 'Manicura', monto: 25 },
]

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales)
  const [reservas, setReservas] = useState<Reserva[]>(reservasIniciales)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [filtroActivos, setFiltroActivos] = useState<boolean | null>(null)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(null)

  const agregarCliente = (nuevoCliente: Omit<Cliente, 'id' | 'fechaRegistro'>) => {
    const id = (clientes.length + 1).toString()
    const fechaRegistro = format(new Date(), 'yyyy-MM-dd')
    setClientes([...clientes, { ...nuevoCliente, id, fechaRegistro }])
    toast.success('Cliente agregado con éxito')
  }

  const actualizarCliente = (clienteActualizado: Cliente) => {
    setClientes(clientes.map(c => c.id === clienteActualizado.id ? clienteActualizado : c))
    toast.success('Cliente actualizado con éxito')
  }

  const eliminarCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id))
    setReservas(reservas.filter(r => r.clienteId !== id))
    toast.success('Cliente eliminado con éxito')
  }

  const toggleEstadoCliente = (id: string) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, activo: !c.activo } : c))
    toast.success('Estado del cliente actualizado')
  }

  const abrirModalEdicion = (cliente: Cliente) => {
    setClienteEditando(cliente)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setClienteEditando(null)
    setModalAbierto(false)
  }

  const guardarCliente = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nuevoCliente = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      activo: formData.get('activo') === 'on'
    }

    if (clienteEditando) {
      actualizarCliente({ ...clienteEditando, ...nuevoCliente })
    } else {
      agregarCliente(nuevoCliente)
    }
    cerrarModal()
  }

  const clientesFiltrados = filtroActivos !== null
    ? clientes.filter(c => c.activo === filtroActivos)
    : clientes

  const reservasCliente = reservas.filter(r => r.clienteId === clienteSeleccionado)

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Administración de Clientes</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona los clientes y sus reservas</p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Listado de Clientes</CardTitle>
            <div className="flex items-center space-x-4">
              <Select
                onValueChange={(value) => setFiltroActivos(value === 'todos' ? null : value === 'activos')}
                defaultValue="todos"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los clientes</SelectItem>
                  <SelectItem value="activos">Clientes activos</SelectItem>
                  <SelectItem value="inactivos">Clientes inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{clienteEditando ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</DialogTitle>
                    <DialogDescription>
                      {clienteEditando ? 'Modifica los detalles del cliente aquí.' : 'Ingresa los detalles del nuevo cliente aquí.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={guardarCliente}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombre" className="text-right">
                          Nombre
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          defaultValue={clienteEditando?.nombre}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={clienteEditando?.email}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telefono" className="text-right">
                          Teléfono
                        </Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          defaultValue={clienteEditando?.telefono}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="activo" className="text-right">
                          Activo
                        </Label>
                        <Switch
                          id="activo"
                          name="activo"
                          defaultChecked={clienteEditando?.activo ?? true}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Guardar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {clientesFiltrados.map((cliente) => (
                  <motion.tr
                    key={cliente.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.fechaRegistro}</TableCell>
                    <TableCell>
                      <Switch
                        checked={cliente.activo}
                        onCheckedChange={() => toggleEstadoCliente(cliente.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => abrirModalEdicion(cliente)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => eliminarCliente(cliente.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setClienteSeleccionado(cliente.id)}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {clienteSeleccionado && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservasCliente.map((reserva) => (
                  <TableRow key={reserva.id}>
                    <TableCell>{reserva.fecha}</TableCell>
                    <TableCell>{reserva.servicio}</TableCell>
                    <TableCell>${reserva.monto}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Clientes</h3>
              <p className="text-3xl font-bold">{clientes.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Clientes Activos</h3>
              <p className="text-3xl font-bold">{clientes.filter(c => c.activo).length}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Reservas</h3>
              <p className="text-3xl font-bold">{reservas.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Toaster position="bottom-right" />
    </div>
  )
}