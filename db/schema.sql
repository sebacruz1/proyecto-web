-- 1. Tabla de Usuarios
CREATE TABLE users (
    id          INT          NOT NULL AUTO_INCREMENT,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    rut         VARCHAR(20)  NOT NULL UNIQUE,
    address     VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('admin', 'user', 'patrullero') NOT NULL DEFAULT 'user',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- 2. Tabla de Turnos (Para el RF1: Inicio y fin de turno con GPS)
CREATE TABLE shifts (
    id            INT NOT NULL AUTO_INCREMENT,
    patrullero_id INT NOT NULL,
    start_time    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time      TIMESTAMP NULL,
    start_lat     DECIMAL(10, 8) NOT NULL,
    start_lng     DECIMAL(11, 8) NOT NULL,
    end_lat       DECIMAL(10, 8) NULL,
    end_lng       DECIMAL(11, 8) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (patrullero_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabla de Seguimiento GPS (Para el RF2: Seguimiento en tiempo real)
CREATE TABLE gps_tracking (
    id          INT NOT NULL AUTO_INCREMENT,
    shift_id    INT NOT NULL,
    lat         DECIMAL(10, 8) NOT NULL,
    lng         DECIMAL(11, 8) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE
);

-- 4. Tabla de Incidentes/Reportes (Para RF3, RF4 y RF7)
CREATE TABLE incidents (
    id           INT NOT NULL AUTO_INCREMENT,
    user_id      INT NULL, -- Es NULL si el reporte es anónimo (RF7)
    type         VARCHAR(100) NOT NULL,
    description  TEXT NOT NULL,
    lat          DECIMAL(10, 8) NOT NULL,
    lng          DECIMAL(11, 8) NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    media_url    VARCHAR(255) NULL, -- URL o path para la foto/video (RF3)
    status       ENUM('recibido', 'en_desarrollo', 'resuelto') NOT NULL DEFAULT 'recibido',
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Tabla de Asignaciones (Para RF6: Ubicación de la unidad de respuesta)
CREATE TABLE assignments (
    id            INT NOT NULL AUTO_INCREMENT,
    incident_id   INT NOT NULL,
    patrullero_id INT NOT NULL,
    assigned_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (patrullero_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Tabla de Línea de Tiempo (Para RF5: Trazabilidad del reporte)
CREATE TABLE incident_timeline (
    id          INT NOT NULL AUTO_INCREMENT,
    incident_id INT NOT NULL,
    status      ENUM('recibido', 'en_desarrollo', 'resuelto') NOT NULL,
    details     VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);