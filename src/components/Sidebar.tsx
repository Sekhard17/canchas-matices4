import { Button } from '@/components/ui/button'
import { Home, MessageCircle, Inbox, Settings } from 'lucide-react'

export default function Sidebar({ sidebarOpen }) {
  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-gray-800`}>
      <nav className="mt-20 px-4 space-y-4">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="mr-2 h-4 w-4" />
          Inicio
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Inbox className="mr-2 h-4 w-4" />
          Módulo de Solicitudes
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </nav>
    </aside>
  )
}
