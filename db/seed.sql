SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ROLES
INSERT INTO roles (id, name, display_name) VALUES
(1, 'admin',      'Administrador'),
(2, 'patrullero', 'Patrullero'),
(3, 'user',       'Ciudadano');

-- USUARIOS  (contraseña: "password")
INSERT INTO users (id, first_name, last_name, rut, address, email, phone, password, role_id) VALUES
-- Administradores (role_id=1)
(1, 'Admin',     'Municipal',  '33.333.333-3', 'Municipalidad Central, Santo Domingo',  'admin@correo.com',          NULL,           '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 1),
(2, 'Carlos',    'Muñoz',      '12.345.678-9', 'Av. Central 100, Santo Domingo',        'carlos.munoz@admin.cl',     '+56912345678', '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 1),
-- Patrulleros (role_id=2)
(3, 'Luis',      'Herrera',    '15.678.901-2', 'Av. Marina 88, Santo Domingo',          'luis.herrera@patrulla.cl',  '+56945678901', '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 2),
(4, 'Valentina', 'Soto',       '16.789.012-3', 'Calle Dos Norte 14, Santo Domingo',     'val.soto@patrulla.cl',      '+56956789012', '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 2),
(5, 'Jorge',     'Ramírez',    '14.567.890-1', 'Pasaje El Roble 5, Santo Domingo',      'jorge.ramirez@patrulla.cl', '+56934567890', '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 2),
-- Ciudadanos (role_id=3)
(6, 'Ana',       'González',   '13.456.789-0', 'Calle Los Pinos 22, Santo Domingo',     'ana.gonzalez@gmail.com',    '+56923456789', '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 3),
(7, 'Pedro',     'Vargas',     '17.890.123-4', 'Av. del Mar 55, Santo Domingo',         'pedro.vargas@gmail.com',    '+56967890123', '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 3),
(8, 'Sofía',     'Castro',     '18.901.234-5', 'Villa Las Palmas 8, Santo Domingo',     'sofia.castro@gmail.com',    '+56978901234', '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 3),
(9, 'Usuario',   'Demo',       '11.111.111-1', 'Calle Ciudadana 123, Santo Domingo',    'user@correo.com',           NULL,           '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 3),
(10,'Patrullero','Demo',       '22.222.222-2', 'Base Municipal Norte, Santo Domingo',   'patrullero@correo.com',     NULL,           '$2b$12$2vLHIYKAYzl6lvJE/WnoJu56fkJ1N0kYusSYrpdKzH2BmK4ZerRr.', 2);

-- TURNOS
INSERT INTO shifts (id, patrullero_id, status, start_time, end_time, start_lat, start_lng, end_lat, end_lng) VALUES
-- Turnos finalizados
(1, 3,  'finalizado', '2025-05-20 08:00:00', '2025-05-20 16:00:00', -33.63660000, -71.62730000, -33.64100000, -71.61800000),
(2, 4,  'finalizado', '2025-05-20 08:00:00', '2025-05-20 16:00:00', -33.64200000, -71.62500000, -33.63900000, -71.62100000),
(3, 3,  'finalizado', '2025-05-21 08:00:00', '2025-05-21 16:00:00', -33.63500000, -71.63000000, -33.63800000, -71.62400000),
(4, 5,  'finalizado', '2025-05-22 08:00:00', '2025-05-22 16:00:00', -33.64000000, -71.62000000, -33.64300000, -71.61500000),
(5, 4,  'finalizado', '2025-05-23 08:00:00', '2025-05-23 16:00:00', -33.63700000, -71.62800000, -33.63500000, -71.62200000),
-- Turnos activos hoy
(6, 3,  'activo',     CURRENT_TIMESTAMP,      NULL,                  -33.63660000, -71.62730000, NULL,         NULL),
(7, 4,  'activo',     CURRENT_TIMESTAMP,      NULL,                  -33.64200000, -71.62500000, NULL,         NULL);

-- GPS TRACKING
INSERT INTO gps_tracking (shift_id, lat, lng, recorded_at) VALUES
-- Turno 1 - Luis
(1, -33.63660000, -71.62730000, '2025-05-20 08:00:00'),
(1, -33.63720000, -71.62650000, '2025-05-20 08:15:00'),
(1, -33.63800000, -71.62500000, '2025-05-20 08:30:00'),
(1, -33.63950000, -71.62200000, '2025-05-20 08:45:00'),
(1, -33.64100000, -71.61800000, '2025-05-20 09:00:00'),
-- Turno 2 - Valentina
(2, -33.64200000, -71.62500000, '2025-05-20 08:00:00'),
(2, -33.64100000, -71.62300000, '2025-05-20 08:20:00'),
(2, -33.63900000, -71.62100000, '2025-05-20 08:40:00'),
-- Turno 6 - Luis (activo hoy)
(6, -33.63660000, -71.62730000, CURRENT_TIMESTAMP),
(6, -33.63700000, -71.62680000, CURRENT_TIMESTAMP),
-- Turno 7 - Valentina (activa hoy)
(7, -33.64200000, -71.62500000, CURRENT_TIMESTAMP),
(7, -33.64150000, -71.62450000, CURRENT_TIMESTAMP);

-- INCIDENTES
INSERT INTO incidents (id, user_id, type, description, lat, lng, status, created_at) VALUES
-- Resueltos (mes anterior)
(1,  6, 'Accidente Vehicular',  'Choque entre dos vehículos en la intersección con Av. del Mar. Hay daños materiales, sin heridos graves.',                            -33.63800000, -71.63000000, 'resuelto',      DATE_SUB(CURDATE(), INTERVAL 40 DAY)),
(2,  7, 'Luminaria Dañada',     'Poste de luz caído en calle Los Pinos esquina Av. Central. Riesgo para peatones y vehículos.',                                        -33.63500000, -71.62800000, 'resuelto',      DATE_SUB(CURDATE(), INTERVAL 38 DAY)),
(3,  8, 'Ruido Excesivo',       'Fiesta con música a alto volumen desde las 23:00 hrs en sector Villa Las Palmas. No cesan pese a solicitudes vecinales.',              -33.64300000, -71.62100000, 'resuelto',      DATE_SUB(CURDATE(), INTERVAL 35 DAY)),
-- En desarrollo (este mes)
(4,  6, 'Vehículo Sospechoso',  'Camioneta blanca sin patente visible estacionada frente al colegio municipal hace más de 3 horas con ocupantes en el interior.',      -33.64000000, -71.62000000, 'en_desarrollo', DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(5,  7, 'Persona Sospechosa',   'Individuo merodeando el perímetro de la plaza de armas hace aproximadamente una hora. Actitud evasiva, no reside en el sector.',      -33.63600000, -71.62400000, 'en_desarrollo', DATE_SUB(CURDATE(), INTERVAL 8 DAY)),
(6,  8, 'Vandalismo',           'Rayados con aerosol en el muro exterior de la escuela básica N°1. Daños de consideración en fachada recién pintada.',                 -33.63200000, -71.63200000, 'en_desarrollo', DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
-- Recibidos (este mes)
(7,  7, 'Basura Clandestina',   'Microbasural en sitio eriazo de calle El Roble con Av. Marina. Lleva varios días acumulándose sin que nadie lo retire.',              -33.64500000, -71.61700000, 'recibido',      DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(8,  6, 'Accidente Vehicular',  'Motocicleta chocó contra un poste en Av. del Mar. El conductor está consciente pero con heridas leves. Solicitan ambulancia.',        -33.63900000, -71.62900000, 'recibido',      DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(9,  6, 'Luminaria Dañada',     'Tres postes de luz sin funcionar en el pasaje San Pedro entre los números 100 y 200. El sector queda completamente oscuro de noche.',  -33.63100000, -71.63500000, 'recibido',      DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(10, 8, 'Ruido Excesivo',       'Bar de la calle Comercio con música a máximo volumen. Situación se repite cada fin de semana desde medianoche.',                      -33.64600000, -71.62300000, 'recibido',      DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- ASIGNACIONES
INSERT INTO assignments (incident_id, patrullero_id, status, assigned_at, completed_at) VALUES
-- Resueltas
(1, 3, 'completado', '2025-05-20 09:20:00', '2025-05-20 11:00:00'),
(2, 4, 'completado', '2025-05-20 14:35:00', '2025-05-20 16:30:00'),
(3, 5, 'completado', '2025-05-22 00:05:00', '2025-05-22 01:20:00'),
-- En camino
(4, 4, 'en_camino',  '2025-05-23 10:30:00', NULL),
(5, 3, 'en_camino',  '2025-05-23 15:15:00', NULL),
(6, 5, 'asignado',   '2025-05-24 08:00:00', NULL);

-- LÍNEA DE TIEMPO
INSERT INTO incident_timeline (incident_id, status, details, changed_by, created_at) VALUES
-- Incidente 1 (resuelto)
(1, 'recibido',     'Reporte recibido automáticamente desde la app.',                          NULL, '2025-05-20 09:15:00'),
(1, 'en_desarrollo','Patrullero Luis Herrera asignado. Unidad en camino al lugar.',            2,    '2025-05-20 09:20:00'),
(1, 'resuelto',     'Accidente atendido. Carabineros en el lugar. Tráfico normalizado.',       2,    '2025-05-20 11:00:00'),
-- Incidente 2 (resuelto)
(2, 'recibido',     'Reporte recibido automáticamente desde la app.',                          NULL, '2025-05-20 14:30:00'),
(2, 'en_desarrollo','Patrullera Valentina Soto asignada al incidente.',                        2,    '2025-05-20 14:35:00'),
(2, 'resuelto',     'Poste retirado de la vía. Empresa eléctrica notificada para reparación.', 2,    '2025-05-20 16:30:00'),
-- Incidente 3 (resuelto)
(3, 'recibido',     'Reporte recibido automáticamente desde la app.',                                               NULL, '2025-05-21 23:45:00'),
(3, 'en_desarrollo','Patrullero Jorge Ramírez asignado. Unidad en camino.',                    1,    '2025-05-22 00:05:00'),
(3, 'resuelto',     'Situación controlada. Vecinos notificados. Música detenida.',             1,    '2025-05-22 01:20:00'),
-- Incidente 4 (en desarrollo)
(4, 'recibido',     'Reporte recibido automáticamente desde la app.',                          NULL, '2025-05-23 10:20:00'),
(4, 'en_desarrollo','Patrullera Valentina Soto asignada. Unidad en camino al lugar.',          2,    '2025-05-23 10:30:00'),
-- Incidente 5 (en desarrollo)
(5, 'recibido',     'Reporte recibido automáticamente desde la app.',                                               NULL, '2025-05-23 15:05:00'),
(5, 'en_desarrollo','Patrullero Luis Herrera asignado a la zona.',                             2,    '2025-05-23 15:15:00'),
-- Incidente 6 (en desarrollo)
(6, 'recibido',     'Reporte recibido automáticamente desde la app.',                          NULL, '2025-05-24 07:50:00'),
(6, 'en_desarrollo','Patrullero Jorge Ramírez asignado. Acudirá al inicio de turno.',          2,    '2025-05-24 08:00:00'),
-- Incidentes pendientes (solo entrada inicial)
(7,  'recibido',    'Reporte recibido automáticamente desde la app.',                          NULL, '2025-05-24 11:30:00'),
(8,  'recibido',    'Reporte recibido automáticamente desde la app.',                                               NULL, '2025-05-24 13:45:00'),
(9,  'recibido',    'Reporte recibido automáticamente desde la app.',                          NULL, '2025-05-25 19:00:00'),
(10, 'recibido',    'Reporte recibido automáticamente desde la app.',                                               NULL, '2025-05-25 00:30:00');
