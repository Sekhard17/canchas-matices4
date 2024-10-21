//src/hooks/useAuth.ts
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { login } from '@/services/authService'
import { decodeToken, CustomJwtPayload } from '@/utils/jwtUtils'
import { useEffect, useState } from 'react'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<CustomJwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si el usuario tiene una sesión activa
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const decodedToken: CustomJwtPayload = decodeToken(token)
      setUser(decodedToken)
    } catch (error) {
      console.error('Token inválido:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password)
      localStorage.setItem('token', data.token)

      const decodedToken: CustomJwtPayload = decodeToken(data.token)
      setUser(decodedToken)

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('¡Sesión cerrada!')
    router.push('/')
  }

  return { user, isLoading, handleLogin, handleLogout }
}
