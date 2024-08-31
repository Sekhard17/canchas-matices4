'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast, Toaster } from 'react-hot-toast'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, MoonIcon, SunIcon } from 'lucide-react'

export default function LoginElegante() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    toast.success('Inicio de sesión exitoso')
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-400 to-blue-500'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')", filter: 'blur(8px)', opacity: 0.2}}></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className={`border-none shadow-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                Matices Canchas
              </CardTitle>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-sm text-muted-foreground">Ingresa a tu cuenta para reservar</p>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <MoonIcon className="w-20 h-20 text-green-500" />
              </motion.div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-green-500 transition-all duration-300"
                    required
                  />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-green-500 transition-all duration-300"
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
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Recordarme
                </label>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-300">
                Iniciar sesión
              </Button>
            </form>
          </CardContent>
          <Separator className={`my-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-green-500 transition-all duration-300">
              Registrarse
            </Button>
            <Button variant="link" className="text-sm text-blue-500 hover:text-blue-600 transition-colors duration-300">
              ¿Olvidaste tu contraseña?
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  )
}