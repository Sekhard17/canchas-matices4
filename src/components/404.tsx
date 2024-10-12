'use client'

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { LockIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const Particle = ({ index }: { index: number }) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 2
  const size = Math.random() * 3 + 1

  return (
    <motion.div
      className="absolute bg-blue-400 rounded-full"
      style={{
        top: `${randomY}%`,
        left: `${randomX}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: randomDelay,
      }}
    />
  )
}

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden p-4">
      <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl">
        {[...Array(50)].map((_, i) => (
          <Particle key={i} index={i} />
        ))}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01]
            }}
            className="text-center p-8 md:p-12 rounded-2xl shadow-2xl bg-gray-800 bg-opacity-30 backdrop-blur-md relative z-10 border border-gray-700"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <LockIcon className="w-20 h-20 md:w-28 md:h-28 text-blue-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-white mb-4 md:mb-6 relative"
            >
              <span className="relative inline-block">
                <span className="absolute inset-0 animate-glitch-1">404</span>
                <span className="absolute inset-0 animate-glitch-2">404</span>
                <span className="relative z-10">404</span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-blue-200 mb-6 md:mb-8"
            >
              Acceso No Autorizado
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-base md:text-lg text-gray-300 mb-8 md:mb-10"
            >
              Lo sentimos, debes iniciar sesión para acceder a esta página.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-full transition duration-300 transform hover:scale-105 hover:shadow-lg">
                <Link href="/login">
                  Iniciar Sesión
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}