export async function login(correo: string, contraseña: string) {
    const response = await fetch('https://canchas-matices.fly.dev/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña }),
    })
  
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error)
    }
  
    return response.json()
  }
  