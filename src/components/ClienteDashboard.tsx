"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, Clock, MapPin, User, LogOut, Settings, ChevronRight, Search, Menu, X } from 'lucide-react'

const reservas = [
  { id: 1, fecha: '2024-08-20', cancha: 'Cancha Principal', hora: '10:00 AM', estado: 'Confirmada' },
  { id: 2, fecha: '2024-08-22', cancha: 'Cancha 2', hora: '12:00 PM', estado: 'Pendiente' },
  { id: 3, fecha: '2024-08-25', cancha: 'Cancha de F&uacute;tbol 7', hora: '3:00 PM', estado: 'Confirmada' },
  { id: 4, fecha: '2024-08-28', cancha: 'Cancha Principal', hora: '5:00 PM', estado: 'Pendiente' },
  { id: 5, fecha: '2024-09-01', cancha: 'Cancha de F&uacute;tbol 7', hora: '11:00 AM', estado: 'Confirmada' },
  { id: 6, fecha: '2024-09-03', cancha: 'Cancha 2', hora: '2:00 PM', estado: 'Pendiente' },
]

export default function NewDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">SportReserve</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar reservas..."
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&amp;width=32" alt="@username" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuraci&oacute;n</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesi&oacute;n</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`md:w-64 ${menuOpen ? 'block' : 'hidden'} md:block`}>
            <Card>
              <CardHeader>
                <CardTitle>Nueva Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <div className="flex">
                      <Input id="fecha" type="date" className="rounded-r-none" />
                      <Button type="button" variant="outline" size="icon" className="rounded-l-none">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancha">Cancha</Label>
                    <select id="cancha" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>Cancha Principal</option>
                      <option>Cancha 2</option>
                      <option>Cancha de F&uacute;tbol 7</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora</Label>
                    <Input id="hora" type="time" />
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Reservar Ahora
                  </Button>
                </form>
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Bienvenido, Juan</h2>
              <p className="text-gray-600 dark:text-gray-400">Gestiona tus reservas de canchas f&aacute;cilmente</p>
            </motion.div>

            <Tabs defaultValue="proximas" className="mb-8">
              <TabsList>
                <TabsTrigger value="proximas">Pr&oacute;ximas Reservas</TabsTrigger>
                <TabsTrigger value="calendario">Calendario</TabsTrigger>
              </TabsList>
              <TabsContent value="proximas">
                <Card>
                  <CardHeader>
                    <CardTitle>Pr&oacute;ximas Reservas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      {reservas.map((reserva) => (
                        <motion.div 
                          key={reserva.id}
                          className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">{reserva.cancha}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{reserva.fecha}</p>
                            </div>
                            <Badge variant={reserva.estado === 'Confirmada' ? "default" : "destructive"}>
                              {reserva.estado}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="mr-2 h-4 w-4" />
                            {reserva.hora}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="mr-2 h-4 w-4" />
                            Complejo Deportivo Central
                          </div>
                        </motion.div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Ver Todas las Reservas
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="calendario">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendario de Reservas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Estad&iacute;sticas de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: "Reservas Este Mes", value: "28", icon: CalendarIcon },
                    { title: "Horas Jugadas", value: "56", icon: Clock },
                    { title: "Cancha Favorita", value: "Principal", icon: MapPin },
                    { title: "Ahorro del Mes", value: "$120", icon: User },
                  ].map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="flex flex-col items-center p-6">
                        <stat.icon className="h-8 w-8 mb-2 text-teal-500" />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                        <h4 className="text-2xl font-bold mt-1">{stat.value}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
