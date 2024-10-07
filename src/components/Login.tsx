'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode' // Importación corregida
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast, Toaster } from 'react-hot-toast'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react'
import { GiSoccerBall } from 'react-icons/gi'

interface DecodedToken {
  id: string
  rol: string
  exp: number
}

export default function LoginElegante() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded: DecodedToken = jwtDecode(token)
      if (decoded.exp * 1000 > Date.now()) {
        redirigirDashboard(decoded.rol)
      } else {
        localStorage.removeItem('token')
      }
    }
  }, [])

  const redirigirDashboard = (rol: string) => {
    switch (rol) {
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'cliente':
        router.push('/cliente')
        break
      case 'encargado':
        router.push('/encargado/dashboard')
        break
      default:
        toast.error('Rol de usuario no reconocido')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('https://canchas-back-4.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          contraseña: password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const token = data.token

        localStorage.setItem('token', token)

        const decoded: DecodedToken = jwtDecode(token)
        redirigirDashboard(decoded.rol)
        toast.success('¡Inicio de sesión exitoso!')
      } else {
        const errorData = await response.json()
        toast.error(`Error al iniciar sesión: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.')
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleRegister = () => {
    router.push('/register')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('¡Sesión cerrada exitosamente!')
    router.push('/')
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 to-green-400'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className={`border-none shadow-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
          <CardHeader className="space-y-1 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400">
                Matices Fútbol
              </CardTitle>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-sm text-muted-foreground">Ingresa a tu cuenta para reservar tu cancha</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex justify-center">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <GiSoccerBall className="w-16 h-16 text-blue-500" />
              </motion.div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold">
                Iniciar sesión
              </Button>
            </form>
            <Button
              variant="outline"
              className="w-full mt-4 border-2 border-red-500 text-red-500"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  )
}
