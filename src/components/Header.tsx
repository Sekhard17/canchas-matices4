import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Sun, Moon, Menu, X, LogOut, Home, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeaderProps {
  user: { nombre?: string } | null
  toggleDarkMode: () => void
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  darkMode: boolean
}

export default function Header({
  user,
  toggleDarkMode,
  sidebarOpen,
  setSidebarOpen,
  darkMode,
}: HeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Botón del Sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Título con Usuario */}
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Bienvenido, <span className="text-indigo-600">{user?.nombre || 'Usuario'}</span>
        </h1>

        {/* Controles de Usuario y Modo Oscuro */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </motion.div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1 hover:ring-2 hover:ring-indigo-400 rounded-full transition-all">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://avatar.iran.liara.run/public/18" />
                  <AvatarFallback>{user?.nombre?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Home className="mr-2 h-4 w-4" />
                Inicio
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
