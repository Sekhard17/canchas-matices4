'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaTachometerAlt, FaCalendarAlt, FaUsers, FaUserTie, FaSignOutAlt, FaUser } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItemProps {
  href: string
  icon: IconType
  label: string
  isActive: boolean
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => (
  <Link
    href={href}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
      ${isActive ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
  >
    <Icon className="w-5 h-5 mr-2" />
    <span>{label}</span>
  </Link>
)

export default function EnhancedNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: FaHome, label: 'Inicio' },
    { href: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { href: '/reservas', icon: FaCalendarAlt, label: 'Reservas' },
    { href: '/clientes', icon: FaUsers, label: 'Clientes' },
    { href: '/encargados', icon: FaUserTie, label: 'Encargados' },
  ]

  return (
    <nav className="bg-blue-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Matices</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={pathname === item.href}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <FaUser className="h-5 w-5 text-blue-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Usuario</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      usuario@ejemplo.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Tu Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FaSignOutAlt className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <svg
                    className="h-6 w-6 text-blue-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-blue-950">
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={pathname === item.href}
                    />
                  ))}
                  <Button variant="ghost" className="justify-start text-blue-100 hover:text-white hover:bg-blue-800">
                    <FaUser className="mr-2 h-4 w-4" />
                    Tu Perfil
                  </Button>
                  <Button variant="ghost" className="justify-start text-blue-100 hover:text-white hover:bg-blue-800">
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
