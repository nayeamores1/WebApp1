# AlDía — Gestor de entregas de diseño

Aplicación web full-stack para organizar proyectos académicos de diseño. Permite crear, consultar, editar, completar y eliminar entregas, además de filtrarlas y buscarlas.

## Enlaces del proyecto

- Aplicación web: https://web-app1-7dzkbhnyf-direct-line.vercel.app/
- Backend: https://aldia-api.onrender.com/
- Repositorio: https://github.com/nayeamores1/WebApp1

## Tecnologías

- Frontend: React, TypeScript, Vite y CSS.
- Backend: Node.js, Express y TypeScript.
- Base de datos: Supabase (PostgreSQL).
- Despliegue: Vercel para `client/` y Render para `server/`.

## Funcionalidades

- CRUD completo mediante API REST.
- Lista de entregas con prioridad, materia y fecha límite.
- Filtros por estado y búsqueda por texto.
- Indicador de progreso general.
- Estados de carga, error y éxito.
- Diseño responsive.

## Instalación local

Requisitos: Node.js 18 o superior y un proyecto de Supabase.

1. En Supabase, abre **SQL Editor**, pega el contenido de `supabase/schema.sql` y ejecútalo.
2. Copia `server/.env.example` como `server/.env` y reemplaza los valores con **Project URL** y **anon public key** de Supabase.
3. Copia `client/.env.example` como `client/.env`.
4. Desde la raíz, instala las dependencias:

```bash
npm run install:all
```

5. Abre dos terminales. En la primera ejecuta el backend:

```bash
npm run dev:server
```

6. En la segunda ejecuta el frontend:

```bash
npm run dev:client
```


## Variables de entorno

### Backend (`server/.env`)

```env
PORT=4000
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_KEY=TU_SUPABASE_ANON_KEY
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:4000/api
```

## Endpoints

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/entregas` | Listar entregas |
| POST | `/api/entregas` | Crear entrega |
| PUT | `/api/entregas/:id` | Editar o completar |
| DELETE | `/api/entregas/:id` | Eliminar entrega |

## Despliegue

### Backend en Render

1. Crea un **Web Service** conectado al repositorio.
2. Root Directory: `server`.
3. Build Command: `npm install && npm run build`.
4. Start Command: `npm start`.
5. Agrega `SUPABASE_URL`, `SUPABASE_KEY` y `CLIENT_URL` como variables de entorno.
6. Copia la URL pública resultante.

### Frontend en Vercel

1. Importa el mismo repositorio.
2. Root Directory: `client`.
3. Framework Preset: Vite.
4. Agrega `VITE_API_URL` con la URL de Render seguida de `/api`.
5. Despliega. Después copia la URL de Vercel en `CLIENT_URL` de Render y reinicia el servicio.

## Subir el proyecto a GitHub

Desde la carpeta principal del proyecto:

```bash
git init
git add .
git commit -m "Proyecto full-stack AlDia"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```
