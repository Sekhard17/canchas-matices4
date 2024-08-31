"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A192F]" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        <AlertTriangle className="w-24 h-24 text-yellow-400 mx-auto mb-8" />
        <h1 className="text-4xl font-bold mb-4">404 - P&aacute;gina no encontrada</h1>
        <p className="text-xl mb-8 max-w-md mx-auto">
          Lo sentimos, la p&aacute;gina que est&aacute;s buscando no existe o no tienes acceso a ella.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 relative z-10"
      >
        <Button asChild className="bg-yellow-400 text-[#0A192F] hover:bg-yellow-500">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Ir al inicio
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-[#0A192F]">
          <Link href="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver atr&aacute;s
          </Link>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="text-[20rem] font-bold text-white opacity-5">404</span>
      </motion.div>
    </div>
  )
}
