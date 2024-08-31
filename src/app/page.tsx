"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GiSoccerBall as SoccerBallIcon } from "react-icons/gi";
import { MdCalendarToday as CalendarIcon } from "react-icons/md";
import { FaDownload as DownloadIcon } from "react-icons/fa";
import { MdLocationOn as MapPinIcon } from "react-icons/md";
import { IoIosMenu as MenuIcon } from "react-icons/io";
import { FaApple as AppleIcon, FaGooglePlay as PlayIcon } from "react-icons/fa";
import { MdSmartphone as SmartphoneIcon } from "react-icons/md";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Juan Pérez",
      text: "Matices tiene las mejores canchas de fútbol en Osorno. ¡Siempre vuelvo!", // Se escapa el símbolo "¡"
    },
    {
      name: "María González",
      text: "La app de Matices hace que reservar una cancha sea muy fácil. ¡La recomiendo!", // Se escapa el símbolo "¡"
    },
    {
      name: "Carlos Rodríguez",
      text: "Las instalaciones de Matices son de primera clase. Un lugar excelente para jugar tenis.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]); // Añadimos testimonials.length al array de dependencias

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-900 text-white py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2 text-2xl font-bold" prefetch={false}>
            <SoccerBallIcon className="w-8 h-8" />
            <span>Matices</span>
          </Link>
          <nav
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex items-center gap-6 text-sm font-medium absolute md:relative top-full left-0 right-0 bg-blue-900 md:bg-transparent p-4 md:p-0 flex-col md:flex-row`}
          >
            <Link href="#" className="hover:text-blue-300 transition-colors" prefetch={false}>
              Reservar Cancha
            </Link>
            <Link href="#" className="hover:text-blue-300 transition-colors" prefetch={false}>
              Nosotros
            </Link>
            <Link href="#" className="hover:text-blue-300 transition-colors" prefetch={false}>
              Contacto
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuIcon className="w-6 h-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-blue-900">
                  Bienvenido a Matices
                </h1>
                <p className="text-xl text-blue-700">Disfruta de nuestras canchas de fútbol y tenis en Osorno, Chile.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Reservar Cancha
                  </Button>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <DownloadIcon className="w-5 h-5" />
                    Descargar App
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
              >
                <Image
                  src="/images/matices.jpg"
                  alt="Matices Osorno"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </motion.div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-green-100 opacity-50"></div>
        </section>
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Nuestras Características</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <MapPinIcon className="w-12 h-12 text-blue-600" />,
                  title: "Ubicación Estratégica",
                  description: "Fácil acceso en el corazón de Osorno",
                },
                {
                  icon: <CalendarIcon className="w-12 h-12 text-blue-600" />,
                  title: "Reservas en Línea",
                  description: "Sistema de reservas fácil y rápido",
                },
                {
                  icon: <SmartphoneIcon className="w-12 h-12 text-blue-600" />,
                  title: "App Móvil",
                  description: "Gestiona tus reservas desde tu smartphone",
                },
              ].map((feature, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {feature.icon}
                      <h3 className="text-xl font-semibold mt-4 mb-2 text-blue-900">{feature.title}</h3>
                      <p className="text-blue-600">{feature.description}</p>
                    </motion.div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-blue-900 text-white py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Lo que dicen nuestros clientes</h2>
            <div className="relative h-48">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === activeTestimonial ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg mb-4">&quot;{testimonial.text}&quot;</p> {/* Se escapan las comillas */}
                  <p className="font-semibold">{testimonial.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-blue-900 text-white py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Link href="#" className="flex items-center gap-2 text-2xl font-bold mb-4" prefetch={false}>
                <SoccerBallIcon className="w-8 h-8" />
                <span>Matices</span>
              </Link>
              <p className="text-blue-300">Desarrollado por Spectrum Code Software</p>
            </div>
            <nav className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Enlaces Rápidos</h3>
              <Link href="#" className="block hover:text-blue-300 transition-colors" prefetch={false}>
                Reservar Cancha
              </Link>
              <Link href="#" className="block hover:text-blue-300 transition-colors" prefetch={false}>
                Nosotros
              </Link>
              <Link href="#" className="block hover:text-blue-300 transition-colors" prefetch={false}>
                Contacto
              </Link>
            </nav>
            <div>
              <h3 className="text-lg font-semibold mb-2">Descarga Nuestra App</h3>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="bg-white text-blue-900 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-100 transition-colors"
                  prefetch={false}
                >
                  <AppleIcon className="w-5 h-5" />
                  App Store
                </Link>
                <Link
                  href="#"
                  className="bg-white text-blue-900 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-100 transition-colors"
                  prefetch={false}
                >
                  <PlayIcon className="w-5 h-5" />
                  Google Play
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800 text-center text-blue-300">
            <p>&copy; 2023 Matices. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
