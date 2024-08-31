"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from 'lucide-react'

export default function Component() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-400 to-blue-500 p-4">
      {loading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center mb-4">
            <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#10B981" strokeWidth="10"/>
              <path d="M30 50L45 65L70 40" stroke="#10B981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Canchas Matices Osorno</h1>
          <p className="text-white text-opacity-80">Cargando...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center mb-6">
            <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#10B981" strokeWidth="10"/>
              <path d="M30 50L45 65L70 40" stroke="#10B981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 text-center">Bienvenido a Canchas Matices Osorno</h1>
          <p className="text-xl text-white text-opacity-90 mb-8 text-center">Tu destino para reservar canchas deportivas</p>
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <Button className="bg-white text-green-600 hover:bg-green-100" size="lg">
              <Calendar className="mr-2 h-5 w-5" /> Reservar Ahora
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-green-600" size="lg">
              <Clock className="mr-2 h-5 w-5" /> Ver Horarios
            </Button>
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-green-600" size="lg">
              <MapPin className="mr-2 h-5 w-5" /> Ubicación
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}