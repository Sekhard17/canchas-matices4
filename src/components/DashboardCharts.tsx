import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
)

interface DashboardChartsProps {
  barChartData: any
  lineChartData: any
  chartOptions: any
}

export default function DashboardCharts({
  barChartData,
  lineChartData,
  chartOptions,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">Reservas por Horario</h2>
        <Bar data={barChartData} options={chartOptions} />
      </div>
      <div className="shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">Tendencia de Reservas</h2>
        <Line data={lineChartData} options={chartOptions} />
      </div>
    </div>
  )
}
