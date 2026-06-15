# Proyecto Web

### **Integrantes:**

- Sebastián Cruz
- Francisco Díaz
- Kamila Leiva
- Ignacio Matus de la Parra

## Usuarios de prueba

| Rol        | Email                   | Contraseña |
| ---------- | ----------------------- | ---------- |
| Admin      | `admin@correo.com`      | `password` |
| Patrullero | `patrullero@correo.com` | `password` |
| Ciudadano  | `user@correo.com`       | `password` |

---

## API Endpoints

### Públicos

| Método | Ruta            | Descripción                 |
| ------ | --------------- | --------------------------- |
| GET    | `/api/health`   | Estado del servidor y la BD |
| POST   | `/api/login`    | Iniciar sesión, retorna JWT |
| POST   | `/api/register` | Registrar nuevo ciudadano   |

### Protegidos - requieren `Authorization: Bearer <token>`

| Método | Ruta                  | Rol requerido          | Descripción                                                       |
| ------ | --------------------- | ---------------------- | ----------------------------------------------------------------- |
| GET    | `/api/incidents`      | cualquier rol          | Listar incidentes (filtro `?status=`, paginación `?page=&limit=`) |
| GET    | `/api/stats`          | admin                  | Estadísticas del dashboard                                        |
| GET    | `/api/users`          | admin                  | Listar usuarios (filtro por `?role=`)                             |
| POST   | `/api/users`          | admin                  | Crear usuario                                                     |
| PUT    | `/api/users/:id`      | admin / propio usuario | Editar cualquier usuario desde admin o el propio perfil           |
| PUT    | `/api/profile`        | user / patrullero      | Actualizar el propio perfil                                       |
| GET    | `/api/roles`          | admin                  | Listar roles disponibles                                          |
| POST   | `/api/assignments`    | admin                  | Asignar patrullero a incidente                                    |
| PUT    | `/api/incidents/:id`  | admin                  | Actualizar estado de incidente                                    |
| DELETE | `/api/incidents/:id`  | admin                  | Eliminar incidente                                                |
| POST   | `/api/incidents`      | cualquier rol          | Reportar nuevo incidente                                          |
| GET    | `/api/shifts/active`  | patrullero             | Obtener turno activo                                              |
| POST   | `/api/shifts/start`   | patrullero             | Iniciar turno con ubicación GPS                                   |
| POST   | `/api/shifts/:id/end` | patrullero             | Finalizar turno                                                   |
| POST   | `/api/shifts/:id/gps` | patrullero             | Registrar punto GPS durante turno                                 |

---

## Levantar el proyecto

### Producción (Docker)

Requiere tener **Docker**

1. Copiar el archivo de variables de entorno y completarlo:

   ```bash
   cp .env.example .env
   ```

2. Generar el token JWT

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   Este se debe pegar en el .env

3. Levantar todos los servicios:

   ```bash
   docker compose up --build
   ```

4. Abrir en el navegador: `http://localhost:3001`

Para detener y eliminar los contenedores:

```bash
docker compose down
```

> Si se necesita reiniciar la base de datos desde cero (borra todos los datos):
>
> ```bash
> docker compose down -v
> ```

---

### Desarrollo local

Requiere tener instalados **Node.js** y **Docker**.

1. Copiar el archivo de variables de entorno y completarlo:

   ```bash
   cp .env.example .env
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Levantar solo la base de datos con Docker:

   ```bash
   docker compose up database
   ```

4. En otra terminal, iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir en el navegador: `http://localhost:5173`

---

# EF6

El proyecto esta hosteado en AWS, se puede ingresar en: http://54.233.44.158/
