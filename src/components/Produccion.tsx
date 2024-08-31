'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GiSoccerBall, GiSoccerField } from 'react-icons/gi'
import { FaApple, FaGooglePlay, FaArrowLeft } from 'react-icons/fa'
import { MdPhoneAndroid } from 'react-icons/md'

export default function AppDownloadPage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-500 to-green-400 text-gray-800'}`}>
      <header className="py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-white">
          <FaArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Volver al inicio</span>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className={darkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}
        >
          {darkMode ? <GiSoccerBall className="h-5 w-5" /> : <GiSoccerField className="h-5 w-5" />}
        </Button>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <Card className={`w-full max-w-md border-none shadow-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400">
              Matices App
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <MdPhoneAndroid className="w-32 h-32 text-blue-500" />
              </motion.div>
            </div>
            <p className="text-center text-lg">
              ¡Nuestra app está en desarrollo! Pronto podrás reservar canchas, encontrar rivales y más, todo desde tu teléfono.
            </p>
            <div className="flex justify-center space-x-4">
              <Button disabled className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2">
                <FaApple className="w-6 h-6" />
                <span>App Store</span>
              </Button>
              <Button disabled className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2">
                <FaGooglePlay className="w-6 h-6" />
                <span>Google Play</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <p className="text-sm text-center">
              Sé el primero en saber cuando la app esté lista. ¡Regístrate para recibir notificaciones!
            </p>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white">
              Notifícame cuando esté disponible
            </Button>
          </CardFooter>
        </Card>
      </main>

      <footer className={`py-4 px-6 text-center ${darkMode ? 'text-gray-400' : 'text-white'}`}>
        <p className="text-sm">
          © 2024 Canchas Matices Osorno. Todos los derechos reservados.
        </p>
        <p className="text-xs mt-1">
          Desarrollado con ❤️ por <a href="#" className="underline hover:text-blue-300">Spectrum Code Software</a>
        </p>
      </footer>
    </div>
  )
}