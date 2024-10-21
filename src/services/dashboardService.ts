//src/services/dashboardService.ts
import { supabase } from '@/utils/supabaseClient'

export const obtenerReservas = async (RUT: string) => {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('rut_usuario', RUT)

  if (error) throw error
  return data
}

export const obtenerPagos = async (RUT: string) => {
  const { data, error } = await supabase
    .from('pagos')
    .select('monto')
    .eq('rut_usuario', RUT)

  if (error) throw error
  return data
}

export const obtenerCanchas = async () => {
  const { data, error } = await supabase
    .from('canchas')
    .select('id_cancha, nombre')

  if (error) throw error
  return data
}
