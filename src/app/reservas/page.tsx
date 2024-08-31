'use client';

import Reservas from "@/components/Reservas";
import Navbar from "@/components/Navbar";
import BottomNavigation from "@/components/BottomNavigation";
import { useEffect, useState } from "react";

export default function ReservaPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Ejecutar una vez para configurar el estado inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile ? <BottomNavigation /> : <Navbar />}
      <div className="container mx-auto p-4">
        <Reservas />
      </div>
    </>
  );
}
