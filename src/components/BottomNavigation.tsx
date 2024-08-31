"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, CalendarDays, Users, UserCog, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"

const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/reservas', icon: CalendarDays, label: 'Reservas' },
  { href: '/clientes', icon: Users, label: 'Clientes' },
  { href: '/encargados', icon: UserCog, label: 'Encargados' },
  { href: '/configuracion', icon: Settings, label: 'Config' },
]

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => {
  return (
    <Link href={href} className="relative flex flex-col items-center justify-center w-full">
      <motion.div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full",
          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-6 h-6" />
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-primary rounded-full z-0"
            layoutId="activeBackground"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />
        )}
      </motion.div>
      <span className={cn(
        "text-xs mt-1",
        isActive ? "text-primary font-medium" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </Link>
  )
}

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
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
    </motion.nav>
  )
}
