# Santo Domingo Seguro

Sistema web de reporte y gestión de incidentes municipales para la comuna de Santo Domingo. Permite a los ciudadanos reportar incidentes, a los patrulleros gestionar sus turnos y atender los casos asignados, y a los administradores supervisar y coordinar todo el sistema.

### Integrantes

- Sebastián Cruz
- Francisco Díaz
- Kamila Leiva
- Ignacio Matus de la Parra

### Demo

El proyecto está hosteado en AWS: http://54.233.44.158/

---

## Stack tecnológico

| Capa       | Tecnología                                            |
| ---------- | ----------------------------------------------------- |
| Frontend   | React 19 + TypeScript + Tailwind CSS v4 + Vite        |
| Backend    | Node.js + Express 5                                   |
| Base datos | MySQL 8 (mysql2 con pool de conexiones)               |
| Auth       | JWT (jsonwebtoken) + bcryptjs                         |
| Mapa       | Leaflet + react-leaflet                               |
| Seguridad  | helmet, cors, express-rate-limit                      |
| Deploy     | Docker Compose (3 servicios: database, api, frontend) |

---

## Arquitectura del proyecto

```
proyecto-web/
├── server/
│   └── index.js              # API REST
├── src/
│   ├── lib/
│   │   ├── api.ts            # Cliente HTTP
│   │   └── authUser.ts       # Persistencia del usuario
│   ├── components/
│   │   ├── layout/Navbar.tsx
│   │   ├── profile/ProfileEditModal.tsx
│   │   └── ui/ToastProvider.tsx
│   └── pages/
│       ├── public/           # Login y registro de ciudadanos
│       ├── admin/            # Dashboard de administración
│       ├── patrol/           # Dashboard de patrullero con GPS y mapa
│       └── user/             # Dashboard del ciudadano
├── db/
│   ├── schema.sql            # Estructura de tablas
│   ├── seed.sql              # Datos iniciales
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── .env.example
```

---

## Roles y funcionalidades

### Ciudadano (`user`)

- Registrarse y autenticarse
- Reportar incidentes con ubicación GPS y descripción
- Ver el historial de sus propios reportes con el estado del incidente y del patrullero asignado
- Editar su perfil (nombre, dirección, teléfono)

### Patrullero (`patrullero`)

- Iniciar y finalizar turno (requiere GPS activo)
- Ver mapa con su ubicación en tiempo real (se actualiza cada 30 s)
- Ver los incidentes asignados a su usuario, separados en activos y completados
- Actualizar el estado de sus asignaciones: `asignado -> en_camino -> completado`
- Acceso a incidentes y cambio de estado bloqueados si el turno no está iniciado

### Administrador (`admin`)

- Ver estadísticas del dashboard (casos del mes, resueltos, por tipo)
- Listar todos los incidentes pendientes y asignarles un patrullero
- Ver incidentes en desarrollo separados entre activos y completados por patrullero
- Marcar incidentes como resueltos
- Crear, editar y eliminar usuarios
- Eliminar incidentes

---

## Base de datos

### Tablas principales

| Tabla               | Descripción                                                |
| ------------------- | ---------------------------------------------------------- |
| `roles`             | Roles del sistema: admin, patrullero, user                 |
| `users`             | Usuarios con RUT único, email único y rol asignado         |
| `incidents`         | Incidentes reportados con estado y coordenadas GPS         |
| `assignments`       | Asignaciones de patrullero a incidente con estado propio   |
| `shifts`            | Turnos de patrulleros con hora de inicio/fin y coordenadas |
| `gps_tracking`      | Puntos GPS registrados durante cada turno                  |
| `incident_timeline` | Historial de cambios de estado de cada incidente           |

### Estados de incidente

```
recibido -> en_desarrollo -> resuelto
```

### Estados de asignación (patrullero)

```
asignado -> en_camino -> completado
```

---

## API Endpoints

### Públicos

| Método | Ruta            | Descripción                 |
| ------ | --------------- | --------------------------- |
| GET    | `/api/health`   | Estado del servidor y la BD |
| POST   | `/api/login`    | Iniciar sesión, retorna JWT |
| POST   | `/api/register` | Registrar nuevo ciudadano   |

### Protegidos — requieren `Authorization: Bearer <token>`

| Método | Ruta                           | Rol requerido          | Descripción                                                       |
| ------ | ------------------------------ | ---------------------- | ----------------------------------------------------------------- |
| GET    | `/api/incidents`               | cualquier rol          | Listar incidentes (`?status=`, `?mine=true`, `?page=`, `?limit=`) |
| POST   | `/api/incidents`               | cualquier rol          | Reportar nuevo incidente                                          |
| PUT    | `/api/incidents/:id`           | admin                  | Actualizar estado de incidente                                    |
| DELETE | `/api/incidents/:id`           | admin                  | Eliminar incidente                                                |
| GET    | `/api/incidents/assigned`      | patrullero             | Incidentes asignados al patrullero autenticado                    |
| PATCH  | `/api/assignments/:incidentId` | patrullero             | Actualizar estado de asignación (`en_camino` o `completado`)      |
| POST   | `/api/assignments`             | admin                  | Asignar patrullero a incidente                                    |
| GET    | `/api/stats`                   | admin                  | Estadísticas del dashboard                                        |
| GET    | `/api/users`                   | admin                  | Listar usuarios (`?role=`)                                        |
| POST   | `/api/users`                   | admin                  | Crear usuario                                                     |
| PUT    | `/api/users/:id`               | admin / propio usuario | Editar usuario                                                    |
| DELETE | `/api/users/:id`               | admin                  | Eliminar usuario                                                  |
| PUT    | `/api/profile`                 | cualquier rol          | Actualizar el propio perfil                                       |
| GET    | `/api/roles`                   | admin                  | Listar roles disponibles                                          |
| GET    | `/api/shifts/active`           | patrullero             | Obtener turno activo                                              |
| POST   | `/api/shifts/start`            | patrullero             | Iniciar turno con ubicación GPS                                   |
| POST   | `/api/shifts/:id/end`          | patrullero             | Finalizar turno                                                   |
| POST   | `/api/shifts/:id/gps`          | patrullero             | Registrar punto GPS durante turno                                 |

---

## Variables de entorno

Copiar `.env.example` a `.env` y completar los valores:

| Variable               | Descripción                                               | Ejemplo                                                                    |
| ---------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------- |
| `JWT_SECRET`           | Secreto para firmar tokens JWT (mín. 32 chars aleatorios) | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `DB_HOST`              | Host de MySQL                                             | `127.0.0.1` / `database`                                                   |
| `DB_PORT`              | Puerto de MySQL                                           | `3306`                                                                     |
| `DB_USER`              | Usuario de la base de datos                               | `usuariodb`                                                                |
| `DB_PASSWORD`          | Contraseña de la base de datos                            | —                                                                          |
| `DB_NAME`              | Nombre de la base de datos                                | `muni_sd`                                                                  |
| `MYSQL_ROOT_PASSWORD`  | Contraseña root de MySQL (solo Docker)                    | —                                                                          |
| `APP_PORT`             | Puerto expuesto al exterior (solo Docker)                 | `80`                                                                       |
| `PORT`                 | Puerto interno del servidor API                           | `3001`                                                                     |
| `VITE_API_BASE_URL`    | URL base de la API usada por el frontend al compilar      | `http://localhost:3001`                                                    |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos por CORS (separados por coma)         | `http://localhost:5173,...`                                                |
| `CORS_ALLOWED_HOSTS`   | Hosts permitidos por CORS (separados por coma)            | `localhost,127.0.0.1,...`                                                  |

---

## Usuarios de prueba

| Rol        | Email                   | Contraseña |
| ---------- | ----------------------- | ---------- |
| Admin      | `admin@correo.com`      | `password` |
| Patrullero | `patrullero@correo.com` | `password` |
| Ciudadano  | `user@correo.com`       | `password` |

---

## Levantar el proyecto

### Producción (Docker)

Requiere tener **Docker** instalado.

1. Copiar el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

2. Generar un secreto JWT y pegarlo en `.env`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

3. Levantar todos los servicios:

   ```bash
   docker compose up --build
   ```

4. Abrir en el navegador: `http://localhost`

Para detener los contenedores:

```bash
docker compose down
```

Para reiniciar la base de datos desde cero (elimina todos los datos):

```bash
docker compose down -v
```

---

### Desarrollo local

Requiere tener **Node.js 22+** y **Docker** instalados.

1. Copiar el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Levantar solo la base de datos:

   ```bash
   docker compose up database
   ```

4. En otra terminal, iniciar el servidor de desarrollo (frontend + backend):

   ```bash
   npm run dev
   ```

5. Abrir en el navegador: `http://localhost:5173`
