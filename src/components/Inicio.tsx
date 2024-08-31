/**
 * v0 by Vercel.
 * @see https://v0.dev/t/5cXqe9ewGLp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-[#0a2a4f] text-primary-foreground py-4 px-6 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <LogInIcon className="w-8 h-8" />
          <span className="text-lg font-semibold">Matices</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#" className="hover:underline" prefetch={false}>
            Reservar Cancha
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Nosotros
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Contacto
          </Link>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="w-6 h-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </header>
      <main className="flex-1">
        <section className="bg-[url('/hero-bg.jpg')] bg-cover bg-center py-24 md:py-32 lg:py-40 text-white">
          <div className="container px-4 md:px-6 grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Bienvenido a Matices
              </h1>
              <p className="text-lg md:text-xl">Disfruta de nuestras canchas de fútbol y tenis en Osorno, Chile.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="lg">Reservar Cancha</Button>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-md border border-white/20 text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  prefetch={false}
                >
                  Descargar App
                </Link>
              </div>
            </div>
            <div className="relative h-80 md:h-96 lg:h-[32rem]">
              <img src="/placeholder.svg" alt="Matices Osorno" fill className="object-cover rounded-lg" />
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-4">
              <LocateIcon className="w-12 h-12 text-[#0a2a4f]" />
              <h3 className="text-xl font-semibold">Ubicación</h3>
              <p className="text-muted-foreground">
                Nuestras instalaciones se encuentran en Osorno, Chile. Puedes encontrarnos fácilmente con nuestro mapa
                interactivo.
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-[#0a2a4f] hover:underline" prefetch={false}>
                Ver en el mapa
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid gap-4">
              <CalendarIcon className="w-12 h-12 text-[#0a2a4f]" />
              <h3 className="text-xl font-semibold">Reserva tu Cancha</h3>
              <p className="text-muted-foreground">
                Reserva tu cancha de fútbol o tenis en línea de manera sencilla y rápida.
              </p>
              <Button size="sm">Reservar Ahora</Button>
            </div>
            <div className="grid gap-4">
              <SmartphoneIcon className="w-12 h-12 text-[#0a2a4f]" />
              <h3 className="text-xl font-semibold">Aplicación Móvil</h3>
              <p className="text-muted-foreground">
                Descarga nuestra aplicación móvil para reservar y acceder a información sobre nuestras instalaciones.
              </p>
              <div className="flex gap-2">
                <Link
                  href="#"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-[#0a2a4f] text-primary-foreground text-sm font-medium transition-colors hover:bg-[#0a2a4f]/90 focus:outline-none focus:ring-2 focus:ring-[#0a2a4f] focus:ring-offset-2"
                  prefetch={false}
                >
                  <AppleIcon className="w-5 h-5 mr-2" />
                  App Store
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-[#0a2a4f] text-primary-foreground text-sm font-medium transition-colors hover:bg-[#0a2a4f]/90 focus:outline-none focus:ring-2 focus:ring-[#0a2a4f] focus:ring-offset-2"
                  prefetch={false}
                >
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Google Play
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 grid gap-8 md:grid-cols-2">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Sobre Matices Osorno</h2>
              <p className="text-muted-foreground">
                Matices es un complejo deportivo ubicado en Osorno, Chile, dedicado a ofrecer instalaciones de primera
                calidad para la práctica del fútbol y el tenis. Nuestro objetivo es brindar a la comunidad un espacio
                seguro, moderno y accesible para que puedan disfrutar de sus deportes favoritos.
              </p>
              <p className="text-muted-foreground">
                Contamos con canchas de fútbol y tenis de última generación, así como servicios complementarios como
                vestuarios, cafetería y estacionamiento. Nuestro equipo de profesionales está comprometido en hacer de
                cada visita una experiencia memorable.
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-[#0a2a4f] hover:underline" prefetch={false}>
                Conoce más sobre nosotros
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-80 md:h-96 lg:h-[32rem]">
              <img src="/placeholder.svg" alt="Matices Osorno" fill className="object-cover rounded-lg" />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#0a2a4f] text-primary-foreground py-6 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <LogInIcon className="w-6 h-6" />
          <span className="text-sm font-medium">Matices</span>
          <span className="text-sm font-medium">Developed by Spectrum Code Software</span>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium mt-4 md:mt-0">
          <Link href="#" className="hover:underline" prefetch={false}>
            Términos de Uso
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Política de Privacidad
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Contacto
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function AppleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  )
}


function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}


function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function LocateIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  )
}


function LogInIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  )
}


function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}


function SmartphoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}