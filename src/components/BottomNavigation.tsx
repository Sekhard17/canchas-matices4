'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, CalendarDays, Users, UserCog, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/reservas', icon: CalendarDays, label: 'Reservas' },
  { href: '/clientes', icon: Users, label: 'Clientes' },
  { href: '/encargados', icon: UserCog, label: 'Encargados' },
  { href: '/configuracion', icon: Settings, label: 'Config' },
];

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => {
  return (
    <Link href={href} className="relative group">
      <motion.div
        className={cn(
          "flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-colors duration-300",
          isActive ? "bg-primary" : "bg-background hover:bg-primary/10"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className={cn(
          "w-5 h-5 transition-colors duration-300",
          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
        )} />
        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
            layoutId="activeIndicator"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />
        )}
      </motion.div>
      <span className={cn(
        "absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-medium transition-colors duration-300",
        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
      )}>
        {label}
      </span>
    </Link>
  );
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-background/80 backdrop-blur-lg border border-border rounded-2xl shadow-lg w-[calc(100vw-2rem)] max-w-md"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center px-3 py-2">
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
  );
}
