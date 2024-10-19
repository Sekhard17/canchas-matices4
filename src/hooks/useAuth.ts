import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { login } from '@/services/authService'
import { decodeToken, CustomJwtPayload } from '@/utils/jwtUtils'

export function useAuth() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password)
      localStorage.setItem('token', data.token)

      // Decodificar el token con el tipo definido
      const decodedToken: CustomJwtPayload = decodeToken(data.token)

      toast.success('¡Inicio de sesión exitoso!')

      switch (decodedToken.rol) {
        case 'Administrador':
          router.push('/admin/dashboard')
          break
        case 'Encargado':
          router.push('/encargado/dashboard')
          break
        default:
          router.push('/cliente')
          break
      }
    } catch (error: any) {
      toast.error(`Error al iniciar sesión: ${error.message}`)
    }
  }

  return { handleLogin }
}
