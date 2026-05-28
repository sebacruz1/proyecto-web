-- 1. Insertar Usuarios
INSERT INTO users (id, first_name, last_name, rut, address, email, password, role) VALUES
(1, 'Usuario', 'Demo', '11.111.111-1', 'Calle Ciudadana 123', 'user@correo.com', 'password', 'user'),
(2, 'Patrullero', 'Demo', '22.222.222-2', 'Base Municipal Norte', 'patrullero@correo.com', 'password', 'patrullero'),
(3, 'Admin', 'Municipal', '33.333.333-3', 'Municipalidad Central', 'admin@correo.com', 'password', 'admin');

-- 2. Insertar un Turno Activo para el patrullero
INSERT INTO shifts (id, patrullero_id, start_time, start_lat, start_lng) VALUES
(1, 2, CURRENT_TIMESTAMP, -33.6366, -71.6273);

-- 3. Insertar Puntos GPS de prueba para ese turno
INSERT INTO gps_tracking (shift_id, lat, lng) VALUES
(1, -33.6366, -71.6273),
(1, -33.6370, -71.6280);

-- 4. Insertar Incidentes (Uno normal y uno anónimo)
INSERT INTO incidents (id, user_id, type, description, lat, lng, is_anonymous, status) VALUES
(1, 1, 'Accidente Vehicular', 'Choque en la intersección principal', -33.6380, -71.6300, FALSE, 'en_desarrollo'),
(2, NULL, 'Vehículo Sospechoso', 'Camioneta estacionada hace horas con ocupantes', -33.6400, -71.6200, TRUE, 'recibido');

-- 5. Asignar el Patrullero al primer incidente
INSERT INTO assignments (incident_id, patrullero_id) VALUES
(1, 2);

-- 6. Generar la Trazabilidad (Línea de tiempo) para el primer incidente
INSERT INTO incident_timeline (incident_id, status, details) VALUES
(1, 'recibido', 'El reporte ha sido ingresado en el sistema.'),
(1, 'en_desarrollo', 'Unidad de patrullaje asignada y en camino.');