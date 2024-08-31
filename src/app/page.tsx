'use client'

import { useState, useEffect, ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GiSoccerField, GiWhistle, GiSoccerBall } from "react-icons/gi"
import { FaCalendarAlt, FaUsers, FaMedal, FaInstagram, FaFacebookF, FaTwitter, FaUserCircle, FaDownload } from "react-icons/fa"
import { MdSportsSoccer, MdLocationOn, MdPhone, MdEmail, MdHome, MdContactSupport } from "react-icons/md"

// Definir interfaces para los tipos de los props

interface Slide {
  title: string;
  description: string;
  image: string;
}

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface InstallationCardProps {
  image: string;
  title: string;
  description: string;
}

interface TestimonialCardProps {
  quote: string;
  author: string;
}

export default function MaticesLanding() {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const slides: Slide[] = [
    { title: "Fútbol 5", description: "Canchas de última generación", image: "/images/hero-bg.jpg" },
    { title: "Fútbol 7", description: "Espacio perfecto para tus partidos", image: "/images/matices.jpg" },
    { title: "Torneos", description: "Compite y diviértete", image: "/images/sobre-nosotros.jpg" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2" prefetch={false}>
            <GiSoccerBall className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">Matices Osorno</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="#inicio" icon={<MdHome className="w-5 h-5" />}>Inicio</NavLink>
            <NavLink href="#servicios" icon={<MdSportsSoccer className="w-5 h-5" />}>Servicios</NavLink>
            <NavLink href="#instalaciones" icon={<GiSoccerField className="w-5 h-5" />}>Instalaciones</NavLink>
            <NavLink href="#reservas" icon={<FaCalendarAlt className="w-5 h-5" />}>Reservas</NavLink>
            <NavLink href="#contacto" icon={<MdContactSupport className="w-5 h-5" />}>Contacto</NavLink>

            <Link href="/login">
              <Button variant="outline" size="sm" className="ml-4">
                <FaUserCircle className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/downloads">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <FaDownload className="w-5 h-5 mr-2" />
                Descargar App
              </Button>
            </Link>
          </nav>
          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MdSportsSoccer className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white py-4 shadow-md"
        >
          <div className="container mx-auto flex flex-col space-y-4">
            <NavLink href="#inicio" icon={<MdHome className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)}>Inicio</NavLink>
            <NavLink href="#servicios" icon={<MdSportsSoccer className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)}>Servicios</NavLink>
            <NavLink href="#instalaciones" icon={<GiSoccerField className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)}>Instalaciones</NavLink>
            <NavLink href="#reservas" icon={<FaCalendarAlt className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)}>Reservas</NavLink>
            <NavLink href="#contacto" icon={<MdContactSupport className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)}>Contacto</NavLink>
            
            <Link href="/login">
              <Button variant="outline" size="sm" className="w-full justify-center">
                <FaUserCircle className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/produccion">
              <Button variant="default" size="sm" className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white">
                <FaDownload className="w-5 h-5 mr-2" />
                Descargar App
              </Button>
            </Link>
          </div>
        </motion.nav>
      )}

      <main>
        <section id="inicio" className="relative h-[60vh] md:h-[70vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{slides[currentSlide].title}</h1>
                  <p className="text-lg md:text-xl mb-8">{slides[currentSlide].description}</p>
                  <Link href="/reserva">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Reserva ahora
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <section id="servicios" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                icon={<GiSoccerField className="w-12 h-12 text-blue-600" />}
                title="Canchas de Fútbol 5 y 7"
                description="Césped sintético de última generación y medidas reglamentarias."
              />
              <ServiceCard
                icon={<FaCalendarAlt className="w-12 h-12 text-blue-600" />}
                title="Reservas Online"
                description="Sistema fácil y rápido para reservar tu cancha en cualquier momento."
              />
              <ServiceCard
                icon={<GiWhistle className="w-12 h-12 text-blue-600" />}
                title="Organización de Torneos"
                description="Torneos empresariales y amateurs con premios atractivos."
              />
            </div>
          </div>
        </section>

        <section id="instalaciones" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">Nuestras Instalaciones</h2>
            <Tabs defaultValue="futbol5" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="futbol5">Fútbol 5</TabsTrigger>
                <TabsTrigger value="futbol7">Fútbol 7</TabsTrigger>
              </TabsList>
              <TabsContent value="futbol5">
                <InstallationCard
                  image="/images/hero-bg.jpg"
                  title="Canchas de Fútbol 5"
                  description="4 canchas con césped sintético de alta calidad y sistema de iluminación LED. Perfectas para partidos rápidos y emocionantes con tus amigos."
                />
              </TabsContent>
              <TabsContent value="futbol7">
                <InstallationCard
                  image="/images/matices.jpg"
                  title="Canchas de Fútbol 7"
                  description="2 canchas espaciosas ideales para partidos más grandes y torneos. Disfruta de más espacio y acción en nuestras canchas de fútbol 7."
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="reservas" className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Haz tu Reserva</h2>
            <p className="text-xl mb-8">
              Reserva tu cancha de fútbol 5 o 7 en pocos clics. ¡Juega cuando quieras!
            </p>
            <Link href="/reserva">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Reservar Ahora
              </Button>
            </Link>
          </div>
        </section>

        <section id="opiniones" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">Lo que dicen nuestros jugadores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Las mejores canchas de fútbol en Osorno. Siempre vuelvo con mis amigos."
                author="Juan Pérez"
              />
              <TestimonialCard
                quote="El sistema de reservas online es súper fácil de usar. ¡Recomendado!"
                author="María González"
              />
              <TestimonialCard
                quote="Los torneos que organizan son geniales. Hemos participado en varios y siempre es divertido."
                author="Carlos Rodríguez"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Matices Fútbol</h3>
              <p className="mb-4">Tu lugar para jugar fútbol en Osorno.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-400" aria-label="Instagram">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-blue-400" aria-label="Facebook">
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-blue-400" aria-label="Twitter">
                  <FaTwitter className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="#inicio" className="hover:text-blue-400" prefetch={false}>Inicio</Link></li>
                <li><Link href="#servicios" className="hover:text-blue-400" prefetch={false}>Servicios</Link></li>
                <li><Link href="#instalaciones" className="hover:text-blue-400" prefetch={false}>Instalaciones</Link></li>
                <li><Link href="#reservas" className="hover:text-blue-400" prefetch={false}>Reservas</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Horarios</h3>
              <p>Lunes a Viernes: 15:00 - 0:00</p>
              <p>Sábados y Domingos: 10:00 - 00:00</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MdLocationOn className="w-5 h-5 mr-2" />
                  <span>Av. Real 1065 Rahue Alto, Osorno</span>
                </li>
                <li className="flex items-center">
                  <MdPhone className="w-5 h-5 mr-2" />
                  <span>+56 9 1234 5678</span>
                </li>
                <li className="flex items-center">
                  <MdEmail className="w-5 h-5 mr-2" />
                  <span>info@matices.cl</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 Matices Fútbol. Todos los derechos reservados.</p>
            <p>&copy; Desarrollado por Spectrum Code Software.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ href, children, icon, onClick }: NavLinkProps) {
  return (
    <Link href={href} className="text-gray-600 hover:text-blue-600 transition-colors flex items-center" prefetch={false} onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  )
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6 text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-blue-600">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function InstallationCard({ image, title, description }: InstallationCardProps) {
  return (
    <Card className="bg-white border-gray-200 shadow-lg overflow-hidden">
      <Image src={image} alt={title} width={600} height={400} className="w-full h-64 object-cover" />
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-2 text-blue-600">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6 text-center">
        <FaUsers className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <p className="mb-4 italic text-gray-600">&quot;{quote}&quot;</p>
        <p className="font-semibold text-blue-600">- {author}</p>
      </CardContent>
    </Card>
  )
}
