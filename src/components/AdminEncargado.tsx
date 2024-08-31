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
import { AlertCircle, Edit, Plus, Trash2, Calendar } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

// Tipo para la estructura de un encargado
type Encargado = {
  id: string
  nombre: string
  email: string
  telefono: string
  activo: boolean
}

// Tipo para la estructura de un turno
type Turno = {
  id: string
  encargadoId: string
  fecha: string
  horario: string
}

// Datos de ejemplo
const encargadosIniciales: Encargado[] = [
  { id: '1', nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '123456789', activo: true },
  { id: '2', nombre: 'María López', email: 'maria@example.com', telefono: '987654321', activo: true },
  { id: '3', nombre: 'Carlos Gómez', email: 'carlos@example.com', telefono: '456789123', activo: false },
]

const turnosIniciales: Turno[] = [
  { id: '1', encargadoId: '1', fecha: '2023-06-01', horario: 'Mañana' },
  { id: '2', encargadoId: '2', fecha: '2023-06-01', horario: 'Tarde' },
  { id: '3', encargadoId: '1', fecha: '2023-06-02', horario: 'Noche' },
]

export default function AdminEncargados() {
  const [encargados, setEncargados] = useState<Encargado[]>(encargadosIniciales)
  const [turnos, setTurnos] = useState<Turno[]>(turnosIniciales)
  const [encargadoEditando, setEncargadoEditando] = useState<Encargado | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [filtroActivos, setFiltroActivos] = useState<boolean | null>(null)
  const [tabActual, setTabActual] = useState('encargados')

  const agregarEncargado = (nuevoEncargado: Omit<Encargado, 'id'>) => {
    const id = (encargados.length + 1).toString()
    setEncargados([...encargados, { ...nuevoEncargado, id }])
    toast.success('Encargado agregado con éxito')
  }

  const actualizarEncargado = (encargadoActualizado: Encargado) => {
    setEncargados(encargados.map(e => e.id === encargadoActualizado.id ? encargadoActualizado : e))
    toast.success('Encargado actualizado con éxito')
  }

  const eliminarEncargado = (id: string) => {
    setEncargados(encargados.filter(e => e.id !== id))
    setTurnos(turnos.filter(t => t.encargadoId !== id))
    toast.success('Encargado eliminado con éxito')
  }

  const toggleEstadoEncargado = (id: string) => {
    setEncargados(encargados.map(e => e.id === id ? { ...e, activo: !e.activo } : e))
    toast.success('Estado del encargado actualizado')
  }

  const abrirModalEdicion = (encargado: Encargado) => {
    setEncargadoEditando(encargado)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setEncargadoEditando(null)
    setModalAbierto(false)
  }

  const guardarEncargado = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nuevoEncargado = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      activo: formData.get('activo') === 'on'
    }

    if (encargadoEditando) {
      actualizarEncargado({ ...nuevoEncargado, id: encargadoEditando.id })
    } else {
      agregarEncargado(nuevoEncargado)
    }
    cerrarModal()
  }

  const agregarTurno = (nuevoTurno: Omit<Turno, 'id'>) => {
    const id = (turnos.length + 1).toString()
    setTurnos([...turnos, { ...nuevoTurno, id }])
    toast.success('Turno asignado con éxito')
  }

  const encargadosFiltrados = filtroActivos !== null
    ? encargados.filter(e => e.activo === filtroActivos)
    : encargados

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Administración de Encargados</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona los encargados y sus turnos</p>
      </motion.div>

      <Tabs value={tabActual} onValueChange={setTabActual}>
        <TabsList>
          <TabsTrigger value="encargados">Encargados</TabsTrigger>
          <TabsTrigger value="turnos">Turnos</TabsTrigger>
        </TabsList>
        <TabsContent value="encargados">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Listado de Encargados</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select
                    onValueChange={(value) => setFiltroActivos(value === 'todos' ? null : value === 'activos')}
                    defaultValue="todos"
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los encargados</SelectItem>
                      <SelectItem value="activos">Encargados activos</SelectItem>
                      <SelectItem value="inactivos">Encargados inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="mr-2 h-4 w-4" /> Agregar Encargado
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{encargadoEditando ? 'Editar Encargado' : 'Agregar Nuevo Encargado'}</DialogTitle>
                        <DialogDescription>
                          {encargadoEditando ? 'Modifica los detalles del encargado aquí.' : 'Ingresa los detalles del nuevo encargado aquí.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={guardarEncargado}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                              Nombre
                            </Label>
                            <Input
                              id="nombre"
                              name="nombre"
                              defaultValue={encargadoEditando?.nombre}
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
                              defaultValue={encargadoEditando?.email}
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
                              defaultValue={encargadoEditando?.telefono}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                              Contraseña
                            </Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
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
                              defaultChecked={encargadoEditando?.activo ?? true}
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
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {encargadosFiltrados.map((encargado) => (
                      <motion.tr
                        key={encargado.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>{encargado.nombre}</TableCell>
                        <TableCell>{encargado.email}</TableCell>
                        <TableCell>{encargado.telefono}</TableCell>
                        <TableCell>
                          <Switch
                            checked={encargado.activo}
                            onCheckedChange={() => toggleEstadoEncargado(encargado.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => abrirModalEdicion(encargado)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => eliminarEncargado(encargado.id)}>
                              <Trash2 className="h-4 w-4" />
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
        </TabsContent>
        <TabsContent value="turnos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Asignación de Turnos</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="mr-2 h-4 w-4" /> Asignar Turno
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Asignar Nuevo Turno</DialogTitle>
                      <DialogDescription>
                        Selecciona un encargado y asigna un turno.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      agregarTurno({
                        encargadoId: formData.get('encargadoId') as string,
                        fecha: formData.get('fecha') as string,
                        horario: formData.get('horario') as string,
                      })
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="encargadoId" className="text-right">
                            Encargado
                          </Label>
                          <Select name="encargadoId">
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecciona un encargado" />
                            </SelectTrigger>
                            <SelectContent>
                              {encargados.filter(e => e.activo).map((encargado) => (
                                <SelectItem key={encargado.id} value={encargado.id}>{encargado.nombre}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="fecha" className="text-right">
                            Fecha
                          </Label>
                          <Input
                            id="fecha"
                            name="fecha"
                            type="date"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="horario" className="text-right">
                            Horario
                          </Label>
                          <Select name="horario">
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecciona un horario" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mañana">Mañana</SelectItem>
                              <SelectItem value="Tarde">Tarde</SelectItem>
                              <SelectItem value="Noche">Noche</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Asignar Turno</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Encargado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {turnos.map((turno) => (
                      <motion.tr
                        key={turno.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>{encargados.find(e => e.id === turno.encargadoId)?.nombre}</TableCell>
                        <TableCell>{turno.fecha}</TableCell>
                        <TableCell>{turno.horario}</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="icon" onClick={() => {
                            setTurnos(turnos.filter(t => t.id !== turno.id))
                            toast.success('Turno eliminado con éxito')
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Encargados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Encargados</h3>
              <p className="text-3xl font-bold">{encargados.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Encargados Activos</h3>
              <p className="text-3xl font-bold">{encargados.filter(e => e.activo).length}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Turnos Asignados</h3>
              <p className="text-3xl font-bold">{turnos.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Toaster position="bottom-right" />
    </div>
  )
}