import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu'
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
    <header className="bg-white dark:bg-gray-800 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Botón para abrir/cerrar Sidebar */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <motion.div
            initial={{ rotate: sidebarOpen ? 180 : 0 }}
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </Button>

        {/* Título */}
        <h1 className="text-2xl md:text-xl font-bold text-center">
          Bienvenido, {user?.nombre || 'Usuario'}
        </h1>

        {/* Opciones de Modo Oscuro y Menú de Usuario */}
        <div className="flex items-center space-x-4">
          {/* Botón de Modo Oscuro */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            <motion.div 
              initial={{ rotate: 0, scale: 1 }}
              animate={{ rotate: darkMode ? 180 : 0, scale: darkMode ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </motion.div>
          </Button>

          {/* Menú Dropdown del Usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8">
                <Avatar className="h-8 w-8 hover:ring-2 hover:ring-indigo-500 transition-all">
                  <AvatarImage src="https://avatar.iran.liara.run/public/18" />
                  <AvatarFallback>{user?.nombre?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white dark:bg-gray-700 shadow-lg rounded-lg transition-all"
            >
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-600">
                <Home className="mr-2 h-4 w-4" />
                Inicio
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-600">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-600">
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
