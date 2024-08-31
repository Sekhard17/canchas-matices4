"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, CreditCard, DollarSign, Lock, CheckCircle2 } from 'lucide-react'

interface ReservaData {
  reservaId: string
  cliente: {
    nombre: string
    email: string
    telefono: string
    avatar?: string
  }
  reserva: {
    fecha: Date
    cancha: string
    horas: { hora: string; precio: number }[]
    tieneBalon: boolean
  }
}

const reservaData: ReservaData = {
  reservaId: "123456789",
  cliente: {
    nombre: "Carlos Rivas",
    email: "carlos@example.com",
    telefono: "+56912345678",
    avatar: "https://example.com/avatar.jpg",
  },
  reserva: {
    fecha: new Date(),
    cancha: "Cancha 1",
    horas: [
      { hora: "10:00 - 11:00", precio: 5000 },
      { hora: "11:00 - 12:00", precio: 5000 },
    ],
    tieneBalon: true,
  },
}

export default function PagoReservaEstilizado() {
  const [metodoPago, setMetodoPago] = useState<string>("tarjeta")
  const [numeroTarjeta, setNumeroTarjeta] = useState<string>("")
  const [fechaVencimiento, setFechaVencimiento] = useState<string>("")
  const [cvv, setCvv] = useState<string>("")
  const [pagoCompletado, setPagoCompletado] = useState<boolean>(false)

  const total = reservaData.reserva.horas.reduce((acc, curr) => acc + curr.precio, 0)

  const handlePago = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular procesamiento de pago
    setTimeout(() => {
      setPagoCompletado(true)
    }, 2000)
  }

  const MotionCard = motion(Card)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <MotionCard 
        className="w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">Pago de Reserva</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!pagoCompletado ? (
              <motion.div
                key="payment-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Detalles de la Reserva</h3>
                      <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-5 h-5 text-blue-500" />
                          <span>{format(reservaData.reserva.fecha, 'dd MMMM yyyy', { locale: es })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Cancha:</span>
                          <span>{reservaData.reserva.cancha}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Horas:</span>
                          <ul className="list-disc list-inside">
                            {reservaData.reserva.horas.map((h, index) => (
                              <li key={index}>{h.hora} - ${h.precio.toLocaleString()}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Balón:</span>
                          <span>{reservaData.reserva.tieneBalon ? 'Incluido' : 'No incluido'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total a pagar:</span>
                        <span className="text-2xl text-blue-600">${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <Tabs defaultValue="tarjeta" onValueChange={(value) => setMetodoPago(value)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="tarjeta">Tarjeta</TabsTrigger>
                        <TabsTrigger value="flow">Flow</TabsTrigger>
                        <TabsTrigger value="transbank">Transbank</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tarjeta">
                        <form onSubmit={handlePago} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="numeroTarjeta">Número de tarjeta</Label>
                            <Input
                              id="numeroTarjeta"
                              placeholder="1234 5678 9012 3456"
                              value={numeroTarjeta}
                              onChange={(e) => setNumeroTarjeta(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fechaVencimiento">Fecha de vencimiento</Label>
                              <Input
                                id="fechaVencimiento"
                                placeholder="MM/AA"
                                value={fechaVencimiento}
                                onChange={(e) => setFechaVencimiento(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                            <Lock className="mr-2 h-4 w-4" />
                            Pagar Ahora
                          </Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="flow">
                        <div className="text-center p-4">
                          <img src="/placeholder.svg?height=60&width=120" alt="Flow logo" className="mx-auto mb-4" />
                          <Button onClick={handlePago} className="w-full bg-blue-600 hover:bg-blue-700">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Pagar con Flow
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="transbank">
                        <div className="text-center p-4">
                          <img src="/placeholder.svg?height=60&width=120" alt="Transbank logo" className="mx-auto mb-4" />
                          <Button onClick={handlePago} className="w-full bg-red-600 hover:bg-red-700">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar con Transbank
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="payment-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10"
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">¡Pago Exitoso!</h2>
                <p className="text-gray-600 mb-6">Tu reserva ha sido confirmada.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Ver Detalles de la Reserva
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center">
            <Lock className="w-4 h-4 mr-2" />
            Todos los pagos son procesados de forma segura
          </p>
        </CardFooter>
      </MotionCard>
    </div>
  )
}