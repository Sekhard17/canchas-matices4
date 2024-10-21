// src/components/Navbar.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { Menu, LogOut, User, CalendarIcon, Settings } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { user, handleLogout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-white text-2xl font-bold">Matices Fútbol</h1>

        {/* Dropdown del Usuario */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <p className="text-sm font-medium">{user?.nombre}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start space-x-2"
                  onClick={() => router.push('/cliente')}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Mis Reservas</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start space-x-2"
                  onClick={() => router.push('/perfil')}
                >
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start space-x-2"
                  onClick={() => router.push('/configuracion')}
                >
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                </Button>
              </div>
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start space-x-2 text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
