//src/utils/jwtUtils.ts
import { jwtDecode } from 'jwt-decode' 

// Definimos la interfaz del payload del JWT
export interface CustomJwtPayload {
  id: string
  rol: string
  nombre: string
  apellido: string
}

// Función para decodificar el token JWT
export function decodeToken(token: string): CustomJwtPayload {
  return jwtDecode<CustomJwtPayload>(token)
}
