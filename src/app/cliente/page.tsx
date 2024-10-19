// src/app/cliente/page.tsx
'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { PuffLoader } from 'react-spinners'
import { Sidebar, Header, DashboardCards, DashboardCharts } from '../../components'
import { useState } from 'react'

export default function Dashboard() {
  const { reservas, saldoGastado, canchaFavorita, horarioFavorito, user, loading } = useDashboard()
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PuffLoader color="#36d7b7" size={100} />
      </div>
    )
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <Header
        user={user}
        toggleDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar sidebarOpen={sidebarOpen} />

      <main className="lg:ml-64 pt-20 px-4 sm:px-6 lg:px-8 py-8">
        <DashboardCards
          totalReservas={reservas.length}
          saldoGastado={saldoGastado}
          canchaFavorita={canchaFavorita}
          horarioFavorito={horarioFavorito}
        />
        <DashboardCharts />
      </main>
    </div>
  )
}
