'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, Home, Calendar, FileText, BarChart2, Users, User, Settings, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

type Profile = 'administrador' | 'encargado' | 'cliente'

const navItems: Record<Profile, NavItem[]> = {
  administrador: [
    { label: 'Inicio', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Canchas', href: '/canchas', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Reservas', href: '/reservas', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Solicitudes', href: '/solicitudes', icon: <FileText className="w-4 h-4" /> },
    { label: 'Reportes', href: '/reportes', icon: <BarChart2 className="w-4 h-4" /> },
    { label: 'Usuarios', href: '/usuarios', icon: <Users className="w-4 h-4" /> },
  ],
  encargado: [
    { label: 'Inicio', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Reservas', href: '/reservas', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Solicitudes', href: '/solicitudes', icon: <FileText className="w-4 h-4" /> },
    { label: 'Reportes', href: '/reportes', icon: <BarChart2 className="w-4 h-4" /> },
  ],
  cliente: [
    { label: 'Inicio', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Dashboard', href: '/dashboard', icon: <BarChart2 className="w-4 h-4" /> },
    { label: 'Reservas', href: '/reservas', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Mis Pagos', href: '/pagos', icon: <FileText className="w-4 h-4" /> },
    { label: 'Solicitudes', href: '/solicitudes', icon: <FileText className="w-4 h-4" /> },
  ],
}

type NavbarProps = {
  profile: Profile
  user: {
    name: string
    lastName: string
    avatar: string
  }
}

export default function Navbar({ profile, user }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  return (
    <nav className="bg-[#040038] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                <span className="sr-only">Logo</span>
                {/* Reemplaza esto con tu logo */}
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#040038]">
                  Logo
                </div>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems[profile].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'bg-[#0600a0] text-white'
                        : 'text-gray-300 hover:bg-[#0600a0] hover:text-white'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out flex items-center`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={`${user.name} ${user.lastName}`} />
                      <AvatarFallback>{user.name[0]}{user.lastName[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.charAt(0).toUpperCase() + profile.slice(1)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-[#040038] inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#0600a0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems[profile].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`${
                  router.pathname === item.href
                    ? 'bg-[#0600a0] text-white'
                    : 'text-gray-300 hover:bg-[#0600a0] hover:text-white'
                } px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out flex items-center`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={`${user.name} ${user.lastName}`} />
                  <AvatarFallback>{user.name[0]}{user.lastName[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user.name} {user.lastName}</div>
                <div className="text-sm font-medium leading-none text-gray-400">{profile}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/perfil"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#0600a0] transition-colors duration-200 ease-in-out"
              >
                Mi Perfil
              </Link>
              <Link
                href="/configuracion"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#0600a0] transition-colors duration-200 ease-in-out"
              >
                Configuración
              </Link>
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-[#0600a0] transition-colors duration-200 ease-in-out"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}