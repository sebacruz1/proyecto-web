# Proyecto Web

# 1.1

# 1.2

# 1.3

# 1.4

# 1.5

# 1.6

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
