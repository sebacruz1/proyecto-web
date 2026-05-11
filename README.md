# Proyecto Web

### **Integrantes:**
- Sebastián Cruz | 21.147.290-1
- Francisco Díaz | 21.322.379-8
- Kamila Leiva | 21.619.863-8
- Ignacio Matus de la Parra | 21.780.939-8

# EP 1.1 Requerimientos

   ### Requerimientos Funcionales
1. Inicio y fin de turno (Rol: Guardia): El sistema debe permitir al
   guardia que realiza el patrullaje marcar el inicio y fin de su jornada,
   registrando su ubicación de forma obligatoria en la plataforma web.
2. Seguimiento GPS en tiempo real (Rol: Guardia / Administrador):
   Mantener un envío periódico de coordenadas GPS durante el patrullaje del
   guardia para que la central (Admin) pueda visualizar su ruta en un mapa.
3. Captura multimedia in-situ (Rol: Ciudadano / Guardia): Posibilidad
   de adjuntar fotografías y videos cortos directamente desde la cámara del
   dispositivo al realizar un reporte (bloqueando la carga desde la galería
   para evitar fraudes o reportes desfasados).
4. Botón de emergencia SOS (Rol: Ciudadano): Un botón de acceso
   rápido y sobresaliente en la pantalla principal para enviar una alerta
   inmediata con la ubicación GPS a la central. Este botón integrará
   visualmente el fono gratuito de seguridad ciudadana de Santo Domingo
   (1458).
5. Trazabilidad y estado del reporte (Rol: Ciudadano /
   Administrador): El sistema permitirá al usuario visualizar una línea de
   tiempo con el estado de su reporte (recibido, en desarrollo, resuelto),
   cumpliendo con la necesidad de retroalimentación de la municipalidad
   para que el afectado sepa el curso de su caso.
6. Ubicación de la unidad de respuesta (Rol: Ciudadano): Al asignarse
   un guardia a un incidente en desarrollo, el usuario que reportó podrá
   visualizar en un mapa la posición en tiempo real del guardia que va en
   camino.
7. Reporte ciudadano anónimo (Rol: Ciudadano): Opción de enviar
   reportes de incidentes ocultando la identidad del emisor en la base de
   datos visible para los guardias, protegiendo al denunciante y evitando
   conflictos vecinales.
### Requerimientos No Funcionales
1. Rendimiento - GPS de precisión: La ubicación en tiempo real debe
   tener un margen de error máximo de 5 metros y una latencia baja para
   garantizar una respuesta efectiva en caso de emergencia.
2. Seguridad - Privacidad en la ubicación: Los datos de ubicación del
   guardia y la identidad de los ciudadanos deben estar cifrados de extremo
   a extremo para que terceros no puedan interceptar su ruta ni vulnerar sus
   datos.
3. Usabilidad - Estándar Gubernamental: La interfaz de usuario de la
    plataforma web debe construirse basándose en los lineamientos de
    accesibilidad, paleta de colores y contrastes del Kit Digital
    (kitdigital.gob.cl) y el Framework Digital del Gobierno de Chile
    (framework.digital.gob.cl), asegurando una navegación intuitiva y formal.

# EP 1.2 Problema y Usuario Objetivo

La municipalidad de Santo Domingo gestiona actualmente sus operaciones de seguridad de forma manual y fragmentada. Según lo conversado con Juan Pablo, el proceso presenta dos problemas principales:
El primero es la gestión de reportes ciudadanos. Hoy en día, la única vía disponible para que un vecino reporte un incidente es mediante llamada telefónica. Esto genera problemas innecesarios: el ciudadano debe recordar el número, esperar ser atendido y describir verbalmente la situación, lo que puede resultar tedioso y desincentiva el reporte oportuno de incidentes.
El segundo es la coordinación de patrulleros. Las rutas asignadas a cada patrullero se almacenan en una planilla Excel, lo que dificulta su actualización en tiempo real, no permite trazabilidad y obliga al administrador a comunicar los cambios manualmente.
Ante esto, la solución propuesta es centralizar la gestión en una aplicación web con tres roles diferenciados:

- Usuario: Vecino que puede registrarse, enviar reportes con la información necesaria y consultar el estado de sus reportes anteriores.
- Patrullero: Personal de seguridad que puede consultar el vehículo asignado, su ruta del día y los incidentes activos en su zona.
- Administrador: Encargado de gestionar rutas, asignar patrulleros a incidentes y supervisar el estado general de los reportes.

La elección de una aplicación web por sobre una aplicación móvil nativa responde a las necesidades de cada rol. El usuario generará reportes principalmente desde su celular, y una aplicación web evita tener que descargar e instalar una app para un uso ocasional. El administrador, por su parte, trabaja desde un computador, por lo que una interfaz web de escritorio es la más adecuada para su flujo de trabajo actual.

# EP 1.3 Prototipo

A continuación se presenta el enlace al Prototipo del sistema desarrollado con la herramienta Figma. Este diseño ha sido construido respetando los lineamientos visuales e institucionales del Kit Digital del Gobierno de Chile, abarcando la totalidad de las interfaces necesarias para la plataforma de seguridad de la Municipalidad de Santo Domingo. 
- [Link A Figma](https://www.figma.com/design/3oCStUu3iCoRSlm6gDmKbq/Santo-Domingo-Seguro?node-id=1-38&t=S940WCwtDha9h3pI-0)

### **Nota técnica sobre la interacción de inicio de sesión y gestión de roles:**
Dentro del lienzo de Figma se encuentran diseñadas absolutamente todas las vistas del sistema, incluyendo los Dashboards dedicados exclusivamente al perfil de Administrador. 

Sin embargo, al probar el flujo interactivo del prototipo, se notará que el ingreso a la vista de Administrador no está conectado mediante un botón de acceso directo desde la pantalla principal de inicio de sesión. Esta "omisión" de interacción es intencional y responde a una decisión de Arquitectura de Navegación y Eperiencia de Usuario (EP 1.4) que se verá más detalladamente en el siguiente inciso.

En la implementación real del sistema, se contará con un inicio de sesión unificado, donde el comportamiento esperado es que, al ingresar las credenciales (RUT/Correo y Contraseña), el motor de autenticación del sistema evaluará el perfil del usuario:
- Si las credenciales corresponden a un ciudadano, será redirigido a su portal de reportes.
- Si las credenciales corresponden a un funcionario municipal (Guardia o Administrador), el sistema lo redirigirá automáticamente a la vista de gestión correspondiente a su cargo.

Por lo tanto, aunque la interacción mediante "clic" para cambiar de la vista de inicio de sesión a panel administrativo no está enlazada en el prototipo navegable (para no generar un flujo conceptualmente erróneo), todas las vistas están completamente implementadas en el diseño. Durante la fase de desarrollo y programación web del proyecto, el enrutamiento protegido basado en roles se encargará de dirigir a cada usuario a su vista correspondiente tras la validación de sus datos.


# EP 1.4 Arquitectura de Navegación y Experiencia de Usuario

**a) Rutas principales y secundarias**

La aplicación define las siguientes rutas en App.tsx:

| Ruta                    | Vista                  | Acceso          |
| ----------------------- | ---------------------- | --------------- |
| `/login`                | Login                  | Público         |
| `/admin/dashboard`      | Dashboard Admin        | Rol: admin      |
| `/patrullero/dashboard` | Dashboard Patrullero   | Rol: patrullero |
| `/user/dashboard`       | Dashboard Usuario      | Rol: user       |
| `/user/report/new`      | Formulario de reporte  | Rol: user       |
| `/user/report/history`  | Historial de reportes  | Rol: user       |
| `/user/report/:id`      | Seguimiento de reporte | Rol: user       |
| `/`                     | Redirige a `/login`    | —               |
| `*`                     | 404                    | —               |

---

**b) Relaciones jerárquicas entre vistas**

```
/login
├── → /admin/dashboard
│
├── → /patrullero/dashboard
│
└── → /user/dashboard
         ├── → /user/report/new
         ├── → /user/report/history
         └── → /user/report/:id
```

El login actúa como nodo raíz de toda la aplicación. Cada rol tiene su propio árbol de vistas, sin cruce entre ellos.

---

**c) Flujo de navegación entre funcionalidades**

El flujo general de la aplicación es lineal y parte siempre desde el login:

**Flujo Usuario:** Login → Dashboard → (Generar reporte → Formulario → confirmación) | (Ver reportes pasados → Historial → Detalle/Seguimiento)

**Flujo Patrullero:** Login → Dashboard → (ver incidentes asignados en el mapa) | (consultar detalle de incidente)

**Flujo Administrador:** Login → Dashboard → (ver resumen estadístico) | (asignar patrullero a incidente pendiente)

En todos los casos, el cierre de sesión redirige de vuelta a `/login`.

---

**d) Diferenciación de acceso según roles**

El control de acceso se implementa en cada página mediante el hook personalizado de cada rol (`useAdminDashboard`, `usePatrolDashboard`, `useUserDashboard`). Cada uno lee el usuario autenticado desde `authUser.ts` y, si el rol no coincide, redirige a `/login` con `replace: true` para evitar que el usuario pueda volver atrás con el botón del navegador.

| Rol        | Rutas accesibles        |
| ---------- | ----------------------- |
| Sin sesión | `/login`                |
| user       | `/user/dashboard`       |
| patrullero | `/patrullero/dashboard` |
| admin      | `/admin/dashboard`      |

---

**e) Flujo de principales tareas**

**Tarea 1 - Usuario crea un reporte:** Ingresa a la app -> Login -> Dashboard -> presiona "Generar reporte" -> completa formulario -> confirma envío -> vuelve al dashboard

**Tarea 2 - Usuario consulta estado de un reporte:** Login ->Dashboard -> presiona "Ver reportes pasados" -> lista de reportes históricos -> selecciona un reporte -> vista de seguimiento con estado actual

**Tarea 3 - Patrullero consulta sus incidentes:** Login -> Dashboard -> visualiza mapa con incidentes en su zona -> revisa lista de incidentes asignados -> selecciona uno para ver detalle

**Tarea 4 - Administrador asigna un incidente:** Login -> Dashboard -> visualiza incidentes pendientes -> selecciona patrullero disponible en el dropdown -> confirma asignación

---

**f) Puntos críticos de interacción**

Se identifican los siguientes puntos donde un error o fricción tiene mayor impacto en la experiencia:

**Login:** es el único punto de entrada. Si falla la autenticación o el rol no coincide, el usuario queda bloqueado. Actualmente no hay manejo de error visible al usuario.

**Formulario de reporte:** punto donde el ciudadano aporta la información del incidente. La validación de campos y el manejo del estado offline (usuarios en zonas con señal débil) son críticos para asegurar que el reporte llegue correctamente.

**Asignación de patrullero (admin):** acción con efecto directo en la operación. Un doble envío o asignación errónea podría generar conflictos operativos, por lo que requiere confirmación y bloqueo del botón tras el primer click.

**Inicio/fin de turno (patrullero):** la validación de GPS es un prerequisito para iniciar el turno. Si el patrullero no tiene permisos de ubicación activados, el flujo queda interrumpido sin feedback claro.

---

**g) Coherencia de experiencia entre dispositivos**

La aplicación está desarrollada con Tailwind CSS y diseñada con un enfoque responsive, adaptando cada vista al dispositivo que usará cada rol:

**Usuario (móvil):** las vistas de dashboard, formulario de reporte e historial priorizan elementos táctiles de gran tamaño, disposición vertical y acciones prominentes como el botón SOS. El formulario de reporte debe poder completarse con una mano.

**Patrullero (móvil):** el dashboard de patrullero usa un layout de máximo `max-w-2xl` centrado, con tarjetas de incidente accesibles con el pulgar y el mapa de incidentes a pantalla casi completa. El botón de inicio/fin de turno ocupa todo el ancho disponible.

**Administrador (escritorio):** el dashboard de admin usa un grid de estadísticas, un gráfico de barras y una lista de asignaciones. Esta vista asume una pantalla ancha y no requiere optimización táctil. El selector de patrullero (`<select>`) y el botón de asignación son elementos de escritorio convencionales.

Los tres roles comparten el mismo `Navbar` con adaptación por prop de rol, garantizando coherencia visual en la navegación superior.

---

**h) Justificación técnica de las decisiones adoptadas**

**React Router con rutas planas:** se optó por una estructura de rutas planas y explícitas en lugar de rutas anidadas con layouts compartidos, dado que cada rol tiene un layout propio y el nivel de anidamiento actual no lo justifica. Esta decisión simplifica el App.tsx y hace la estructura comprensible para un equipo pequeño.

**Control de acceso distribuido por hook:** la validación de rol en cada página mediante hooks personalizados (useAdminDashboard, etc.) separa la lógica de autenticación del JSX y permite testear el comportamiento de cada vista de forma aislada. La centralización en un ProtectedRoute sería más escalable a largo plazo y está prevista para cuando se integre un sistema de autenticación real con tokens.

**Componentes de página modulares:** cada vista está compuesta por componentes específicos de rol con responsabilidades acotadas (ShiftPanel, IncidentMap, AssignedIncidentList). Esto reduce el acoplamiento entre páginas, facilita el mantenimiento paralelo por parte del equipo y permite reemplazar secciones individuales cuando se conecte la API sin tocar el resto de la vista.

**Separación de componentes reutilizables:** los componentes que comparten más de un rol (como `Navbar`) están en `src/components/layout`, mientras que los específicos de página viven dentro de su carpeta de página. Esta convención evita dependencias cruzadas entre roles y hace explícito qué pertenece a quién.

**Aplicación web en lugar de app nativa:** la decisión de construir una PWA responsive en lugar de una aplicación nativa móvil responde directamente a los dos contextos de uso identificados: el vecino reporta desde el celular sin necesidad de instalar nada, y el administrador opera desde un computador donde una interfaz web es el entorno natural de trabajo.

---

## Base de datos

Para desarrollo local

### Levantar solo la base de datos

```bash
docker compose up -d database
```

La base se inicializa automáticamente con:

- `db/schema.sql`
- `db/seed.sql`

esto actualmente entrega 3 usuarios básicos para poder probar reedirecciones

# Bajar servicios y red

```
docker compose down
```

### Credenciales de desarrollo

- Host: `localhost`
- Puerto: `3306`
- Base de datos: `muni_sd`
- Usuario: `santodomingo`
- Password: `santodomingo`
- Root password: `root`

### Re-crear la base desde cero (aplicar schema + seed nuevamente)

```bash
docker compose down -v
docker compose up -d database
```

La API expone:

- `POST /api/login`
- `GET /api/health`
