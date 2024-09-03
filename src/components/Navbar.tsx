'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HomeIcon, LayoutDashboardIcon, CalendarIcon, UsersIcon, UserIcon, LogOutIcon, MenuIcon } from 'lucide-react'

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => (
  <Link href={href} className="relative">
    <Button
      variant="ghost"
      className={`w-full justify-start ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
    {isActive && (
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
        layoutId="activeNavItem"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 30
        }}
      />
    )}
  </Link>
)

export default function ModernNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: HomeIcon, label: 'Inicio' },
    { href: '/dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
    { href: '/reservas', icon: CalendarIcon, label: 'Reservas' },
    { href: '/clientes', icon: UsersIcon, label: 'Clientes' },
    { href: '/encargados', icon: UserIcon, label: 'Encargados' },
  ]

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
                Matices
              </span>
            </Link>
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
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@usuario" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
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
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Tu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Tus Reservas</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="/avatars/01.png" alt="@usuario" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        Usuario
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Tu Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Tus Reservas</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}