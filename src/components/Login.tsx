'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Importar useRouter
import { jwtDecode } from 'jwt-decode' // Importación corregida
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from 'react-hot-toast';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
import { GiSoccerBall } from 'react-icons/gi';

export default function LoginElegante() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter(); // Inicializar router

  interface CustomJwtPayload {
    id: string;
    rol: string;
    nombre: string;
    apellido: string;
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://canchas-matices.fly.dev/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          contraseña: password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        toast.success('¡Inicio de sesión exitoso!');
  
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
  
        // Decodificar el token usando la interfaz personalizada
        const decodedToken = jwtDecode<CustomJwtPayload>(data.token);
  
        // Redirigir según el rol del usuario
        switch (decodedToken.rol) {
          case 'Administrador':
            router.push('/admin/dashboard');
            break;
          case 'Encargado':
            router.push('/encargado/dashboard');
            break;
          case 'Usuario':
          default:
            router.push('/cliente');
            break;
        }
      } else {
        const errorData = await response.json();
        toast.error(`Error al iniciar sesión: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleRegister = () => {
    router.push('/register'); // Redirigir a la página de registro
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-500 to-green-400'}`}>
      <div className="absolute inset-0 overflow-hidden">
        
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className={`border-none shadow-2xl backdrop-blur-sm ${darkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90'}`}>
          <CardHeader className="space-y-1 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400">
                Matices Fútbol
              </CardTitle>
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-sm text-muted-foreground">Ingresa a tu cuenta para reservar tu cancha</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex justify-center">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <GiSoccerBall className="w-16 h-16 text-blue-500" />
              </motion.div>
            </div>
            <div className="text-center text-sm font-medium text-blue-600 dark:text-blue-400">
              ¡Sabia decisión! Estás a un paso de disfrutar del mejor fútbol en Osorno.
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-transparent border-2 border-gray-300 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Recordarme
                </label>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-400 hover:from-blue-600 hover:to-green-500 text-white font-bold transition-all duration-300">
                Iniciar sesión
              </Button>
            </form>
          </CardContent>
          <Separator className={`my-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <CardFooter className="flex flex-col space-y-2 pt-2 pb-6">
            <div className="text-center text-xs">
              ¿Aún no tienes una cuenta? ¡No te pierdas la diversión!
            </div>
            <Button
              variant="outline"
              className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
              onClick={handleRegister} // Enlazar con la página de registro
            >
              Regístrate ahora
            </Button>
            <Button variant="link" className="text-xs text-blue-500 hover:text-blue-600 transition-colors duration-300">
              ¿Olvidaste tu contraseña?
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <Toaster position="bottom-center" />
    </div>
  );
}
