export async function login(correo: string, contraseña: string) {
  try {
    const response = await fetch('https://canchas-matices.fly.dev/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error en el inicio de sesión')
    }

    return await response.json()
  } catch (error: any) {
    console.error('Error al conectar con la API:', error)
    throw new Error('No se pudo conectar al servidor. Intenta nuevamente.')
  }
}
