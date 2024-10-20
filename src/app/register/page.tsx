//src/app/register/page.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast, Toaster } from 'react-hot-toast'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, SunIcon, MoonIcon, UserIcon, AlertTriangleIcon } from 'lucide-react'
import { GiSoccerBall } from 'react-icons/gi'

export default function RegisterElegante() {
  const [name, setName] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [rut, setRut] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    
    try {
      const response = await fetch('https://canchas-matices.fly.dev/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          apellido: apellido,
          correo: email,
          rut: rut,
          contraseña: password,
        }),        
      })

      if (response.status === 201) {
        toast.success('¡Registro exitoso! Bienvenido a Matices Fútbol.')
      } else {
        const errorData = await response.json()
        toast.error(`Error al registrar: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error al registrar:', error)
      toast.error('Error al registrar. Por favor, inténtalo de nuevo más tarde.')
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const formatRut = (value: string) => {
    // Remove non-digits
    const cleaned = value.replace(/\D/g, '')
    // Format as RUT
    const match = cleaned.match(/^(\d{1,2})(\d{3})(\d{3})(\w{1})$/)
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return cleaned
  }

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value)
    setRut(formatted)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 to-green-400'}`}>
      <div className="absolute inset-0 overflow-hidden">
        
      </div>
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
                Únete a Matices Fútbol
              </CardTitle>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-sm text-muted-foreground">Crea tu cuenta y comienza a jugar</p>
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
            <Alert>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Por favor, proporciona datos reales para garantizar la transparencia y seguridad de todos los usuarios. Tu información será tratada con confidencialidad.
              </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="apellido">Apellido</Label>
                <div className="relative">
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Pérez"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="rut">RUT</Label>
                <div className="relative">
                  <Input
                    id="rut"
                    type="text"
                    placeholder="12.345.678-9"
                    value={rut}
                    onChange={handleRutChange}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
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
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-bold transition-all duration-300">
                Registrarse
              </Button>
            </form>
          </CardContent>
          <Separator className={`my-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <CardFooter className="flex flex-col space-y-2 pt-2 pb-6">
            <div className="text-center text-xs">
              ¿Ya tienes una cuenta? Inicia sesión y comienza a jugar.
            </div>
            <Button variant="outline" className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
              Iniciar sesión
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  )
}