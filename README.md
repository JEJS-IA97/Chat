# Real-Time Chat App

Aplicacion de mensajeria en tiempo real construida con React, Node.js, MongoDB y Socket.IO.

## Caracteristicas
- Autenticacion con JWT y contrasenas cifradas con bcryptjs.
- Chat en tiempo real con Socket.IO.
- Historial de mensajes persistido en MongoDB.
- Solicitudes y gestion de contactos.
- Limpieza local y borrado definitivo de mensajes.
- Frontend responsive con React, Vite y Tailwind CSS.
- Documentacion HTTP con Swagger en `/api-docs`.

## Stack

### Frontend
- React
- Vite
- Tailwind CSS
- socket.io-client

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JWT
- bcryptjs
- Swagger UI

## Estructura
- `frontend/`: aplicacion cliente.
- `backend/`: API HTTP, Socket.IO y Swagger.
- `e2e/`: base de pruebas con Playwright, Cypress, Selenium, Newman y Lighthouse.

## Variables de entorno

### Backend
Usa `backend/.env` tomando como base `backend/.env.example`.

Variables principales:
- `PORT`: puerto del backend.
- `JWT_SECRET`: secreto para firmar tokens.
- `CORS_ORIGIN`: origen permitido para el frontend.
- `PUBLIC_API_URL`: URL publica usada por Swagger para mostrar el server correcto.
- `MONGO_URI`: conexion a MongoDB.
- `SKIP_DB`: si vale `true`, arranca sin conectar MongoDB.

### Frontend
Usa `frontend/.env.local` tomando como base `frontend/.env.example`.

Variables principales:
- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Instalacion local

### 1. Clonar el repositorio
```bash
git clone https://github.com/JEJS-IA97/Chat.git
cd Chat
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Configurar el backend
Crea `backend/.env` a partir de `backend/.env.example` y completa tus valores reales.

Ejemplo:
```env
PORT=3000
JWT_SECRET=tu_secreto
CORS_ORIGIN=http://127.0.0.1:4173
PUBLIC_API_URL=http://127.0.0.1:3000
MONGO_URI=tu_uri_de_mongodb
SKIP_DB=false
```

### 4. Instalar dependencias del frontend
```bash
cd ../frontend
npm install
```

### 5. Configurar el frontend
Crea `frontend/.env.local` a partir de `frontend/.env.example`.

Ejemplo:
```env
VITE_API_URL=http://127.0.0.1:3000
VITE_SOCKET_URL=http://127.0.0.1:3000
```

### 6. Levantar backend y frontend
En una terminal:
```bash
cd backend
npm run dev
```

En otra terminal:
```bash
cd frontend
npm run dev
```

## Swagger

### Ver Swagger en local
1. Levanta el backend con `npm run dev` dentro de `backend/`.
2. Abre [http://127.0.0.1:3000/api-docs](http://127.0.0.1:3000/api-docs).
3. Si quieres el JSON de OpenAPI, abre [http://127.0.0.1:3000/api-docs.json](http://127.0.0.1:3000/api-docs.json).

### Ver Swagger en produccion
1. Despliega el backend en Render.
2. Configura `PUBLIC_API_URL` con la URL publica del backend.
3. Abre `https://tu-backend.onrender.com/api-docs`.
4. Si quieres el JSON, abre `https://tu-backend.onrender.com/api-docs.json`.

## Produccion

### Render
Variables recomendadas del backend:
```env
JWT_SECRET=tu_secreto
MONGO_URI=tu_uri_real
CORS_ORIGIN=https://tu-frontend.vercel.app
PUBLIC_API_URL=https://tu-backend.onrender.com
SKIP_DB=false
```

### Vercel
Variables recomendadas del frontend:
```env
VITE_API_URL=https://tu-backend.onrender.com
VITE_SOCKET_URL=https://tu-backend.onrender.com
```

## QA
La base de pruebas automatizadas vive en `e2e/`.

Comandos utiles:
- `npm run stack:up`
- `npm run test:playwright`
- `npm run test:cypress`
- `npm run test:selenium`
- `npm run test:newman`
- `npm run test:lighthouse`
