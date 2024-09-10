'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, Heart, Bell, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/buscar', icon: Search, label: 'Buscar' },
  { href: '/favoritos', icon: Heart, label: 'Favoritos' },
  { href: '/notificaciones', icon: Bell, label: 'Notificaciones' },
  { href: '/perfil', icon: User, label: 'Perfil' },
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
        className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all duration-300 ${
          isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-6 h-6" />
        <span className="text-xs font-medium mt-1">{label}</span>
      </motion.div>
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 w-8 h-1 bg-blue-500 rounded-full transform -translate-x-1/2"
          layoutId="activeIndicator"
        />
      )}
    </Link>
  );
};

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white backdrop-blur-lg border border-gray-300 rounded-full shadow-lg max-w-[90%] sm:max-w-[80%] w-full px-4 py-2"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} isActive={pathname === item.href} />
        ))}
      </div>
    </motion.nav>
  );
}
