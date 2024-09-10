'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Search, Heart, Bell, User } from 'lucide-react'
import { cn } from "@/lib/utils"

const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/buscar', icon: Search, label: 'Buscar' },
  { href: '/favoritos', icon: Heart, label: 'Favoritos' },
  { href: '/notificaciones', icon: Bell, label: 'Notificaciones' },
  { href: '/perfil', icon: User, label: 'Perfil' },
]

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => {
  return (
    <Link href={href} className="relative group flex flex-col items-center">
      <motion.div
        className={cn(
          "flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
          isActive ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-primary/10"
        )}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-5 h-5" />
        <motion.span
          className={cn(
            "text-[10px] font-medium mt-1 transition-all duration-300",
            isActive ? "text-primary-foreground" : "text-muted-foreground"
          )}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
        >
          {label}
        </motion.span>
      </motion.div>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 w-6 h-1 bg-primary rounded-full transform -translate-x-1/2"
          layoutId="activeIndicator"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />
      )}
    </Link>
  )
}

export default function CenteredBottomNavBar() {
  const pathname = usePathname()

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className="flex items-center justify-around px-4 py-2 max-w-md mx-auto"
        initial="closed"
        animate="open"
        variants={{
          open: { 
            transition: { staggerChildren: 0.07, delayChildren: 0.2 }
          },
          closed: { 
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
          }
        }}
      >
        {navItems.map((item) => (
          <motion.div
            key={item.href}
            variants={{
              open: {
                y: 0,
                opacity: 1,
                transition: {
                  y: { stiffness: 1000, velocity: -100 }
                }
              },
              closed: {
                y: 50,
                opacity: 0,
                transition: {
                  y: { stiffness: 1000 }
                }
              }
            }}
          >
            <NavItem
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.nav>
  )
}