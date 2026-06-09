SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS roles (
    id           TINYINT      NOT NULL AUTO_INCREMENT,
    name         VARCHAR(50)  NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id         INT          NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    rut        VARCHAR(20)  NOT NULL UNIQUE,
    address    VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    phone      VARCHAR(20)  NULL,
    password   VARCHAR(255) NOT NULL,
    role_id    TINYINT      NOT NULL DEFAULT 3,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shifts (
    id            INT       NOT NULL AUTO_INCREMENT,
    patrullero_id INT       NOT NULL,
    status        ENUM('activo', 'finalizado', 'cancelado') NOT NULL DEFAULT 'activo',
    start_time    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time      TIMESTAMP NULL,
    start_lat     DECIMAL(10, 8) NOT NULL,
    start_lng     DECIMAL(11, 8) NOT NULL,
    end_lat       DECIMAL(10, 8) NULL,
    end_lng       DECIMAL(11, 8) NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (patrullero_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_shift_times CHECK (end_time IS NULL OR end_time > start_time),
    INDEX idx_shifts_patrullero (patrullero_id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gps_tracking (
    id          INT       NOT NULL AUTO_INCREMENT,
    shift_id    INT       NOT NULL,
    lat         DECIMAL(10, 8) NOT NULL,
    lng         DECIMAL(11, 8) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    INDEX idx_gps_shift_time (shift_id, recorded_at)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS incidents (
    id           INT      NOT NULL AUTO_INCREMENT,
    user_id      INT      NULL,
    type         VARCHAR(100) NOT NULL,
    description  TEXT     NOT NULL,
    lat          DECIMAL(10, 8) NOT NULL,
    lng          DECIMAL(11, 8) NOT NULL,
    media_url    TEXT     NULL,
    status       ENUM('recibido', 'en_desarrollo', 'resuelto') NOT NULL DEFAULT 'recibido',
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_incidents_status_date (status, created_at)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assignments (
    id            INT       NOT NULL AUTO_INCREMENT,
    incident_id   INT       NOT NULL,
    patrullero_id INT       NOT NULL,
    status        ENUM('asignado', 'en_camino', 'completado') NOT NULL DEFAULT 'asignado',
    assigned_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at  TIMESTAMP NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (incident_id)   REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (patrullero_id) REFERENCES users(id)     ON DELETE CASCADE,
    UNIQUE KEY uq_assignment (incident_id, patrullero_id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS incident_timeline (
    id          INT     NOT NULL AUTO_INCREMENT,
    incident_id INT     NOT NULL,
    status      ENUM('recibido', 'en_desarrollo', 'resuelto') NOT NULL,
    details     TEXT    NOT NULL,
    changed_by  INT     NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by)  REFERENCES users(id)     ON DELETE SET NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
