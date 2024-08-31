import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Reserva from "@/components/Reserva";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canchas Matices Osorno",
  description: "Desarrollado por Spectrum Code Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
