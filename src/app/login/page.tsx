'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Toaster } from 'react-hot-toast'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react'
import { GiSoccerBall } from 'react-icons/gi'
import router from 'next/router'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { handleLogin } = useAuth()

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(email, password)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 to-green-400'}`}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <Card className={`border-none shadow-2xl ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
          <CardHeader className="space-y-1 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-green-400">Matices Fútbol</CardTitle>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} className="data-[state=checked]:bg-blue-600" />
            </div>
            <p className="text-sm">Ingresa a tu cuenta para reservar tu cancha</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <motion.div animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <GiSoccerBall className="w-16 h-16 text-blue-500" />
              </motion.div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</Button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400">Iniciar sesión</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-2 pb-6">
            <Button variant="outline" className="w-full" onClick={() => router.push('/register')}>Regístrate ahora</Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  )
}
