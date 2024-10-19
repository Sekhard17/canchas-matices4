"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertOctagon, Mail, PhoneCall } from 'lucide-react'
import Link from 'next/link'

export default function UserDisabled() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <AlertOctagon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-gray-800">Usuario Deshabilitado</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-center text-gray-600 mb-6">
              Lo sentimos, su cuenta ha sido deshabilitada. Para obtener más información o reactivar su cuenta, por favor contacte al administrador.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <Mail className="w-5 h-5" />
                <span>admin@canchasmatices.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <PhoneCall className="w-5 h-5" />
                <span>+56 9 1234 5678</span>
              </div>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/">
                Volver al Inicio
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}
