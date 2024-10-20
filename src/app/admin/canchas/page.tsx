// src/app/admin/canchas/page.tsx
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
import { AlertCircle, Edit, Plus, Trash2 } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'

// Tipo para la estructura de una cancha
type Cancha = {
  id: string
  nombre: string
  tipo: string
  capacidad: number
  precioHora: number
  activa: boolean
}

// Datos de ejemplo
const canchasIniciales: Cancha[] = [
  { id: '1', nombre: 'Cancha Principal', tipo: 'Fútbol 11', capacidad: 22, precioHora: 100, activa: true },
  { id: '2', nombre: 'Cancha 2', tipo: 'Fútbol 7', capacidad: 14, precioHora: 75, activa: true },
  { id: '3', nombre: 'Cancha 3', tipo: 'Fútbol 5', capacidad: 10, precioHora: 50, activa: false },
]

export default function AdminCanchas() {
  const [canchas, setCanchas] = useState<Cancha[]>(canchasIniciales)
  const [canchaEditando, setCanchaEditando] = useState<Cancha | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [filtroActivas, setFiltroActivas] = useState<boolean | null>(null)

  const tiposCanchas = ['Fútbol 11', 'Fútbol 7', 'Fútbol 5']

  const agregarCancha = (nuevaCancha: Omit<Cancha, 'id'>) => {
    const id = (canchas.length + 1).toString()
    setCanchas([...canchas, { ...nuevaCancha, id }])
    toast.success('Cancha agregada con &eacute;xito')
  }

  const actualizarCancha = (canchaActualizada: Cancha) => {
    setCanchas(canchas.map(c => c.id === canchaActualizada.id ? canchaActualizada : c))
    toast.success('Cancha actualizada con &eacute;xito')
  }

  const eliminarCancha = (id: string) => {
    setCanchas(canchas.filter(c => c.id !== id))
    toast.success('Cancha eliminada con &eacute;xito')
  }

  const toggleEstadoCancha = (id: string) => {
    setCanchas(canchas.map(c => c.id === id ? { ...c, activa: !c.activa } : c))
    toast.success('Estado de la cancha actualizado')
  }

  const abrirModalEdicion = (cancha: Cancha) => {
    setCanchaEditando(cancha)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setCanchaEditando(null)
    setModalAbierto(false)
  }

  const guardarCancha = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const nuevaCancha = {
      nombre: formData.get('nombre') as string,
      tipo: formData.get('tipo') as string,
      capacidad: parseInt(formData.get('capacidad') as string),
      precioHora: parseFloat(formData.get('precioHora') as string),
      activa: formData.get('activa') === 'on'
    }

    if (canchaEditando) {
      actualizarCancha({ ...nuevaCancha, id: canchaEditando.id })
    } else {
      agregarCancha(nuevaCancha)
    }
    cerrarModal()
  }

  const canchasFiltradas = filtroActivas !== null
    ? canchas.filter(c => c.activa === filtroActivas)
    : canchas

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Administraci&oacute;n de Canchas</h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona las canchas del complejo deportivo</p>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Listado de Canchas</CardTitle>
            <div className="flex items-center space-x-4">
              <Select
                onValueChange={(value) => setFiltroActivas(value === 'todas' ? null : value === 'activas')}
                defaultValue="todas"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las canchas</SelectItem>
                  <SelectItem value="activas">Canchas activas</SelectItem>
                  <SelectItem value="inactivas">Canchas inactivas</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Cancha
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{canchaEditando ? 'Editar Cancha' : 'Agregar Nueva Cancha'}</DialogTitle>
                    <DialogDescription>
                      {canchaEditando ? 'Modifica los detalles de la cancha aqu&iacute;.' : 'Ingresa los detalles de la nueva cancha aqu&iacute;.'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={guardarCancha}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombre" className="text-right">
                          Nombre
                        </Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          defaultValue={canchaEditando?.nombre}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right">
                          Tipo
                        </Label>
                        <Select name="tipo" defaultValue={canchaEditando?.tipo}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposCanchas.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacidad" className="text-right">
                          Capacidad
                        </Label>
                        <Input
                          id="capacidad"
                          name="capacidad"
                          type="number"
                          defaultValue={canchaEditando?.capacidad}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precioHora" className="text-right">
                          Precio/Hora
                        </Label>
                        <Input
                          id="precioHora"
                          name="precioHora"
                          type="number"
                          defaultValue={canchaEditando?.precioHora}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="activa" className="text-right">
                          Activa
                        </Label>
                        <Switch
                          id="activa"
                          name="activa"
                          defaultChecked={canchaEditando?.activa ?? true}
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
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Precio/Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {canchasFiltradas.map((cancha) => (
                  <motion.tr
                    key={cancha.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell>{cancha.nombre}</TableCell>
                    <TableCell>{cancha.tipo}</TableCell>
                    <TableCell>{cancha.capacidad}</TableCell>
                    <TableCell>${cancha.precioHora}</TableCell>
                    <TableCell>
                      <Switch
                        checked={cancha.activa}
                        onCheckedChange={() => toggleEstadoCancha(cancha.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => abrirModalEdicion(cancha)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => eliminarCancha(cancha.id)}>
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

      <Card>
        <CardHeader>
          <CardTitle>Estad&iacute;sticas de Canchas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total de Canchas</h3>
              <p className="text-3xl font-bold">{canchas.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Canchas Activas</h3>
              <p className="text-3xl font-bold">{canchas.filter(c => c.activa).length}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Canchas Inactivas</h3>
              <p className="text-3xl font-bold">{canchas.filter(c => !c.activa).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Toaster position="bottom-right" />
    </div>
  )
}
