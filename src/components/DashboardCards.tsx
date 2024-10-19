import { Card, CardContent } from '@/components/ui/card'
import { CalendarIcon, DollarSign, MapPin, Clock } from 'lucide-react'

export default function DashboardCards({ totalReservas, saldoGastado, canchaFavorita, horarioFavorito }) {
  const cards = [
    { title: 'Total de Reservas', value: totalReservas, icon: CalendarIcon },
    { title: 'Saldo Gastado', value: `$${saldoGastado}`, icon: DollarSign },
    { title: 'Cancha Favorita', value: canchaFavorita, icon: MapPin },
    { title: 'Horario Preferido', value: horarioFavorito, icon: Clock },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm">{card.title}</p>
            <p className="text-2xl font-bold">{card.value}</p>
            <card.icon className="h-6 w-6" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
