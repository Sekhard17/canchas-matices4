"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { CalendarIcon, Clock, MapPin, User, LogOut, Settings, QrCode, PlusCircle, FileText, Menu } from "lucide-react";
import { es } from "date-fns/locale";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const reservas = [
  { id: 1, fecha: "2024-08-20", cancha: "Cancha Principal", hora: "10:00 AM", estado: "Confirmada", qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva1" },
  { id: 2, fecha: "2024-08-22", cancha: "Cancha 2", hora: "12:00 PM", estado: "Pendiente", qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva2" },
  { id: 3, fecha: "2024-08-25", cancha: "Cancha de Fútbol 7", hora: "3:00 PM", estado: "Confirmada", qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva3" },
  { id: 4, fecha: "2024-08-28", cancha: "Cancha Principal", hora: "5:00 PM", estado: "Pendiente", qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva4" },
  { id: 5, fecha: "2024-09-01", cancha: "Cancha de Fútbol 7", hora: "11:00 AM", estado: "Confirmada", qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva5" },
  { id: 6, fecha: "2024-09-03", cancha: "Cancha 2", hora: "2:00 PM", estado: "Pendiente", qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Reserva6" },
];

const lineChartData = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      label: "Reservas por Mes",
      data: [12, 19, 3, 5, 2, 3],
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: "rgba(99, 102, 241, 0.5)",
      tension: 0.3,
    },
  ],
};

const barChartData = {
  labels: ["Cancha Principal", "Cancha 2", "Cancha de Fútbol 7"],
  datasets: [
    {
      label: "Horas Reservadas",
      data: [10, 5, 8],
      backgroundColor: ["rgba(99, 102, 241, 0.6)", "rgba(59, 130, 246, 0.6)", "rgba(16, 185, 129, 0.6)"],
      borderColor: ["rgb(99, 102, 241)", "rgb(59, 130, 246)", "rgb(16, 185, 129)"],
      borderWidth: 1,
    },
  ],
};

const mapEstadoToVariant = (estado: string) => {
  switch (estado) {
    case "Confirmada":
      return "default"; // Mapea 'Confirmada' a 'default'
    case "Pendiente":
      return "secondary"; // Mapea 'Pendiente' a 'secondary'
    default:
      return "outline"; // Usa 'outline' como predeterminado para otros casos
  }
};

export default function EnhancedClienteDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-indigo-900">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 space-y-4">
                  <Button variant="ghost" className="w-full justify-start" onClick={toggleMenu}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Reserva
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={toggleMenu}>
                    <FileText className="mr-2 h-4 w-4" />
                    Solicitudes
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={toggleMenu}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={toggleMenu}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={toggleMenu}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">SportReserve</h1>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-8 w-8" />
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
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Bienvenido, Juan</h2>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tus reservas de canchas fácilmente</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Tus Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="proximas" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="proximas">Próximas</TabsTrigger>
                  <TabsTrigger value="pasadas">Pasadas</TabsTrigger>
                </TabsList>
                <TabsContent value="proximas">
                  <ScrollArea className="h-[400px] w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      {reservas.map((reserva, index) => (
                        <motion.div
                          key={reserva.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="p-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                              <CardTitle className="text-lg">{reserva.cancha}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <Badge variant={mapEstadoToVariant(reserva.estado)}>{reserva.estado}</Badge>
                                <span className="text-sm text-gray-500">{reserva.fecha}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Clock className="mr-2 h-4 w-4" />
                                {reserva.hora}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="mr-2 h-4 w-4" />
                                Complejo Deportivo Central
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 bg-gray-50 dark:bg-gray-800">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="w-full">
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Ver Código QR
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Código QR de Reserva</DialogTitle>
                                    <DialogDescription>Muestra este código al llegar al complejo deportivo.</DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-center py-4">
                                    <img src={reserva.qrCode} alt="Código QR de la reserva" className="w-48 h-48" />
                                  </div>
                                  <div className="text-center">
                                    <p className="font-semibold">{reserva.cancha}</p>
                                    <p>{reserva.fecha} - {reserva.hora}</p>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="pasadas">
                  <p className="text-center text-gray-500 py-4">No hay reservas pasadas para mostrar.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" locale={es} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[200px]">
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
                  </div>
                  <div className="h-[200px]">
                    <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
