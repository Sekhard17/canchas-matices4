# Canchas Matices Osorno

Este es un proyecto de [Next.js](https://nextjs.org/) creado con [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Descripción del Proyecto

Canchas Matices Osorno es una plataforma web desarrollada para gestionar la reserva de canchas de fútbol en la ciudad de Osorno. El objetivo del proyecto es proporcionar una herramienta eficiente y fácil de usar para que los usuarios puedan reservar canchas, verificar la disponibilidad, calificar el servicio y realizar pagos en línea. El sistema también permite la administración completa de las reservas y los usuarios, asegurando una gestión eficaz para los administradores del complejo deportivo.

## Funcionalidades Principales

- **Reserva de Canchas**: Los usuarios pueden ver la disponibilidad de canchas en tiempo real y realizar reservas para una fecha y hora específicas.
- **Gestión de Usuarios**: Incluye un sistema de registro e inicio de sesión para usuarios, donde pueden administrar sus datos personales y ver el historial de reservas.
- **Sistema de Calificaciones**: Los usuarios pueden calificar su experiencia después de utilizar las instalaciones, lo que ayuda a mantener un alto nivel de servicio.
- **Pago en Línea**: Integración con sistemas de pago en línea para que los usuarios puedan pagar sus reservas de manera segura.
- **Panel Administrativo**: Los administradores pueden gestionar las reservas, usuarios, y supervisar la operación general de las canchas a través de un panel administrativo.
- **Verificación con Código QR**: A la llegada, los usuarios pueden presentar un código QR para verificar su reserva, facilitando el control de acceso.
- **Notificaciones**: Envío de notificaciones a los usuarios para recordar sus reservas y cualquier cambio en la disponibilidad.

## Tecnologías Utilizadas

### Frontend

- **Next.js**: Framework utilizado para el desarrollo de la interfaz de usuario con capacidades de rendering estático y dinámico.
- **React**: Biblioteca JavaScript para la construcción de interfaces de usuario.
- **Tailwind CSS**: Framework de CSS utilizado para estilizar la interfaz de manera rápida y eficiente.
- **Radix UI**: Componentes accesibles y de bajo nivel para construir la UI.
- **Framer Motion**: Biblioteca de animaciones para React.

### Backend

- **Express.js**: Framework de Node.js que se utilizará para manejar la lógica del servidor y la comunicación con la base de datos.
- **MySQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar la información de usuarios, reservas, y otras entidades.
- **API REST**: Se utilizará para la comunicación entre el frontend y el backend, facilitando las operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

### Otros

- **Vercel**: Plataforma utilizada para el despliegue y hosting del proyecto.
- **GitHub**: Sistema de control de versiones utilizado para el desarrollo colaborativo y el almacenamiento del código fuente.

## Estructura del Proyecto

El proyecto sigue una estructura modular donde cada funcionalidad está organizada en componentes reutilizables. Los archivos principales del proyecto incluyen:

- `app/page.tsx`: Página principal del proyecto, donde se muestra el contenido inicial.
- `components/`: Contiene todos los componentes reutilizables del proyecto, como botones, formularios, modales, etc.
- `pages/`: Estructura de las diferentes páginas del sitio web.
- `public/`: Archivos estáticos como imágenes y fuentes.
