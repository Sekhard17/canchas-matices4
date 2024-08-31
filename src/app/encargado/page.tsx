'use client'
import Verificacion from "@/components/Verificacion";
import Navbar from "@/components/Navbar";
import BottomNavigation from "@/components/BottomNavigation";
import { useEffect, useState } from "react";

export default function Veri() {
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
        <Verificacion />
      </div>
    </>
  );
}
