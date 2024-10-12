'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Mail, Lock, Calendar, Clock, History, Pencil, Save, UserCircle, FileText, Key } from "lucide-react"

type Usuario = {
  rut: string
  nombre: string
  apellido: string
  email: string
  password: string
  creado: string
  ultimoLogin: string
  reservas: { fecha: string, cancha: string }[]
}

const formatRut = (rut: string) => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '')
  const lastDigit = cleanRut.slice(-1)
  const rutBody = cleanRut.slice(0, -1)
  const formattedRut = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${formattedRut}-${lastDigit}`
}

export default function PerfilUsuario() {
  const [editingField, setEditingField] = useState<keyof Usuario | null>(null)
  const [usuario, setUsuario] = useState<Usuario>({
    rut: '196776168',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@ejemplo.com',
    password: '********',
    creado: '2023-01-15',
    ultimoLogin: '2023-06-10 15:30',
    reservas: [
      { fecha: '2023-06-01', cancha: 'Cancha 1' },
      { fecha: '2023-05-15', cancha: 'Cancha 2' },
      { fecha: '2023-05-01', cancha: 'Cancha 1' },
      { fecha: '2023-04-20', cancha: 'Cancha 3' }
    ]
  })

  const handleEdit = (field: keyof Usuario) => {
    setEditingField(field)
  }

  const handleSave = (field: keyof Usuario) => {
    setEditingField(null)
    // Aquí iría la lógica para guardar los cambios en el backend
  }

  const renderEditableField = (field: keyof Usuario, icon: React.ReactNode, label: string) => (
    <div className="flex flex-col space-y-1">
      <Label htmlFor={field} className="text-sm font-medium text-gray-700 flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id={field}
          value={usuario[field] as string}
          readOnly={editingField !== field}
          className="flex-grow"
          onChange={(e) =>
            setUsuario((prev) => ({
              ...prev,
              [field]: e.target.value
            }))
          }
        />
        <Button
          size="icon"
          variant="outline"
          onClick={() => (editingField === field ? handleSave(field) : handleEdit(field))}
        >
          {editingField === field ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-5xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <UserCircle className="w-6 h-6" />
          <span>Perfil de Usuario</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-secondary/20 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm font-medium">Cuenta creada el: {usuario.creado}</p>
                <p className="text-sm text-gray-600">Último inicio: {usuario.ultimoLogin}</p>
              </div>
            </div>
            <Button variant="outline" className="bg-primary/10 hover:bg-primary/20">
              Ver detalles
            </Button>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="rut" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>RUT:</span>
            </Label>
            <Input id="rut" value={formatRut(usuario.rut)} readOnly className="flex-grow bg-secondary/10" />
          </div>
          {renderEditableField('nombre', <User className="w-5 h-5 text-primary" />, 'Nombre')}
          {renderEditableField('apellido', <User className="w-5 h-5 text-primary" />, 'Apellido')}
          {renderEditableField('email', <Mail className="w-5 h-5 text-primary" />, 'Email')}
          {renderEditableField('password', <Key className="w-5 h-5 text-primary" />, 'Contraseña')}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold flex items-center space-x-2 text-primary">
            <History className="w-6 h-6" />
            <span>Historial de actividad</span>
          </h3>
          <Card className="bg-white/50 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Fecha</TableHead>
                  <TableHead className="w-1/2">Cancha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuario.reservas.map((reserva, index) => (
                  <TableRow key={index}>
                    <TableCell>{reserva.fecha}</TableCell>
                    <TableCell>{reserva.cancha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
