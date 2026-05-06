# Proyecto Web

## Estado actual

- Base del proyecto creada con React.
- Estilos con Tailwind CSS v4.
- Enrutamiento con React Router.
- Vista de login implementada en `/login`
  - diseño visual inicial,
  - validación básica de campos,
  - mostrar/ocultar contraseña,
  - estados de carga y error,

## Estructura base

- `src/pages/public/`: Vistas publicas
- `src/pages/user/`: Vistas de rol = user
- `src/pages/admin/`: Vistas de rol = admin
- `src/pages/patrol/`: Vistas de rol = patrol

## Rutas

- `/login`: Ruta base para logearse.
  > Redirección automática de `/`.
- `/admin/`: Rutas para vistas de admin
- `/p/`: Rutas para trabajadores
