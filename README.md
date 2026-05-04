# 💬 Real-Time Chat App

Una aplicación de mensajería en tiempo real completa, segura y responsiva, construida con React, Node.js, MongoDB y Socket.io.

## 🚀 Características Principales

* **Autenticación Segura:** Sistema de registro e inicio de sesión utilizando JSON Web Tokens (JWT) y encriptación de contraseñas con bcryptjs.
* **Mensajería en Tiempo Real:** Comunicación instantánea entre usuarios gracias a la implementación de WebSockets con Socket.io.
* **Gestión de Historial:** Los mensajes se guardan en una base de datos MongoDB, permitiendo recuperar el historial de chat al iniciar sesión.
* **Borrado Avanzado de Mensajes:** 
  * *Borrar para mí:* Oculta los mensajes localmente sin afectar el chat del otro usuario.
  * *Borrar para todos:* Elimina permanentemente los mensajes de la base de datos para ambos participantes.
* **Buscador Integrado:** Búsqueda en tiempo real de mensajes específicos dentro de una conversación activa.
* **Interfaz Moderna:** Diseño limpio y responsivo (adaptable a diferentes tamaños de pantalla) utilizando Tailwind CSS.

## 🛠️ Tecnologías Utilizadas

**Frontend:**
* [React](https://reactjs.org/) (con Vite)
* [Socket.io-client](https://socket.io/)
* [Tailwind CSS](https://tailwindcss.com/) (Estilos)

**Backend:**
* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* [Socket.io](https://socket.io/) (WebSockets)
* [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) (Base de Datos)
* [JWT](https://jwt.io/) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs) (Autenticación y Seguridad)

## ⚙️ Instalación y Uso Local

Sigue estos pasos para correr el proyecto en tu máquina local:

### Prerrequisitos
* [Node.js](https://nodejs.org/) instalado.
* Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) o MongoDB instalado localmente.

### 1. Clonar el repositorio

```bash
git clone [https://github.com/JEJS-IA97/Chat.git](https://github.com/JEJS-IA97/Chat.git)
cd Chat bash
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

### 3. Abre una nueva terminal y navega a la carpeta del frontend

```bash
cd frontend
npm install
```
