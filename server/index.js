import cors from "cors";
import express from "express";
import compression from "compression";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
app.use(compression());
const port = Number(process.env.PORT ?? 3001);

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("JWT_SECRET no está configurado.");
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "santodomingo",
  password: process.env.DB_PASSWORD ?? "santodomingo",
  database: process.env.DB_NAME ?? "muni_sd",
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
});


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": [
          "'self'", 
          "data:", 
          "https://*.tile.openstreetmap.org", 
          "https://a.tile.openstreetmap.org", 
          "https://b.tile.openstreetmap.org", 
          "https://c.tile.openstreetmap.org", 
          "https://unpkg.com"
        ],
      },
    },
  })
);
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS. Bloqueado por seguridad."));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta de nuevo en 15 minutos." },
});

const DUMMY_HASH = await bcrypt.hash("__dummy__", 12);

const [rolesRows] = await pool.execute("SELECT name FROM roles");
const VALID_ROLES = new Set(rolesRows.map((r) => r.name));

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res
      .status(500)
      .json({ ok: false, message: "Sin conexión a base de datos." });
  }
});

app.post("/api/login", loginRateLimit, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ message: "Email y contraseña son obligatorios." });
    return;
  }

  if (String(email).length > 254 || String(password).length > 72) {
    res.status(400).json({ message: "Credenciales con formato inválido." });
    return;
  }

  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.password, u.first_name, u.last_name, u.rut, u.address,
              r.id AS role_id, r.name AS role, r.display_name AS role_display
       FROM users u JOIN roles r ON r.id = u.role_id
       WHERE u.email = ? LIMIT 1`,
      [String(email).trim().toLowerCase()],
    );

    const user = rows[0];
    const suppliedPassword = String(password);
    const storedHash = user ? String(user.password) : DUMMY_HASH;

    const matches = await bcrypt.compare(suppliedPassword, storedHash);
    if (!matches || !user) {
      res.status(401).json({ message: "Credenciales incorrectas." });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, roleId: user.role_id, email: user.email },
      jwtSecret,
      { expiresIn: "8h" },
    );

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      roleId: user.role_id,
      roleDisplay: user.role_display,
      firstName: user.first_name,
      lastName: user.last_name,
      rut: user.rut,
      address: user.address,
      token,
      message: "Login correcto.",
    });
  } catch (error) {
    console.error("Error en login", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Demasiados registros desde esta IP. Intenta en 1 hora.",
  },
});

app.post("/api/register", registerRateLimit, async (req, res) => {
  const { firstName, lastName, rut, address, email, password } = req.body ?? {};

  const fieldErrors = {};
  if (!firstName || !String(firstName).trim())
    fieldErrors.firstName = "El nombre es obligatorio.";
  if (!lastName || !String(lastName).trim())
    fieldErrors.lastName = "El apellido es obligatorio.";
  if (!rut || !String(rut).trim()) fieldErrors.rut = "El RUT es obligatorio.";
  if (!address || !String(address).trim())
    fieldErrors.address = "La dirección es obligatoria.";
  if (!email || !String(email).trim())
    fieldErrors.email = "El correo electrónico es obligatorio.";
  else if (String(email).length > 254)
    fieldErrors.email = "El correo es demasiado largo.";
  if (!password) fieldErrors.password = "La contraseña es obligatoria.";
  else if (String(password).length < 6)
    fieldErrors.password = "Mínimo 6 caracteres.";
  else if (String(password).length > 72)
    fieldErrors.password = "La contraseña es demasiado larga.";

  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({
      message: "Hay campos obligatorios sin completar.",
      fields: fieldErrors,
    });
  }

  try {
    const cleanEmail = String(email).trim().toLowerCase();
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR rut = ? LIMIT 1",
      [cleanEmail, String(rut).trim()],
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "El correo o RUT ya está registrado." });
    }
    const hashedPassword = await bcrypt.hash(String(password), 12);

    await pool.execute(
      "INSERT INTO users (first_name, last_name, rut, address, email, password, role_id) VALUES (?, ?, ?, ?, ?, ?, 3)",
      [
        String(firstName).trim(),
        String(lastName).trim(),
        String(rut).trim(),
        String(address).trim(),
        cleanEmail,
        hashedPassword,
      ],
    );

    res.status(201).json({ message: "Cuenta creada correctamente." });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.post("/api/users", verificarToken, soloAdmin, async (req, res) => {
  const { firstName, lastName, rut, address, email, phone, password, role } =
    req.body ?? {};

  const fieldErrors = {};
  if (!firstName || !String(firstName).trim())
    fieldErrors.firstName = "El nombre es obligatorio.";
  if (!lastName || !String(lastName).trim())
    fieldErrors.lastName = "El apellido es obligatorio.";
  if (!rut || !String(rut).trim()) fieldErrors.rut = "El RUT es obligatorio.";
  if (!address || !String(address).trim())
    fieldErrors.address = "La dirección es obligatoria.";
  if (!email || !String(email).trim())
    fieldErrors.email = "El correo electrónico es obligatorio.";
  else if (String(email).length > 254)
    fieldErrors.email = "El correo es demasiado largo.";
  if (!password) fieldErrors.password = "La contraseña es obligatoria.";
  else if (String(password).length < 6)
    fieldErrors.password = "Mínimo 6 caracteres.";
  else if (String(password).length > 72)
    fieldErrors.password = "La contraseña es demasiado larga.";

  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({
      message: "Hay campos obligatorios sin completar.",
      fields: fieldErrors,
    });
  }

  if (!VALID_ROLES.has(role)) {
    return res.status(400).json({ message: "Rol inválido." });
  }

  try {
    const cleanEmail = String(email).trim().toLowerCase();

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR rut = ? LIMIT 1",
      [cleanEmail, String(rut).trim()],
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "El correo o RUT ya está registrado." });
    }

    const [[roleRow]] = await pool.execute(
      "SELECT id FROM roles WHERE name = ? LIMIT 1",
      [role],
    );

    const hashedPassword = await bcrypt.hash(String(password), 12);

    const [result] = await pool.execute(
      "INSERT INTO users (first_name, last_name, rut, address, email, phone, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        String(firstName).trim(),
        String(lastName).trim(),
        String(rut).trim(),
        String(address).trim(),
        cleanEmail,
        phone ? String(phone).trim() : null,
        hashedPassword,
        roleRow.id,
      ],
    );

    res.status(201).json({
      message: "Usuario creado correctamente.",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.put("/api/users/:id", verificarToken, soloAdmin, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address, phone } = req.body ?? {};

  try {
    const [result] = await pool.execute(
      "UPDATE users SET first_name = ?, last_name = ?, address = ?, phone = ? WHERE id = ?",
      [
        String(firstName).trim(), 
        String(lastName).trim(), 
        String(address).trim(), 
        phone ? String(phone).trim() : null, 
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.json({ message: "Usuario actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.delete("/api/users/:id", verificarToken, soloAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ 
      message: "No se puede eliminar. Es posible que el usuario tenga incidentes asociados." 
    });
  }
});

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Acceso denegado. Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
}

function soloAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso restringido a administradores." });
  }
  next();
}

app.get("/api/roles", verificarToken, soloAdmin, async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, display_name FROM roles ORDER BY id",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo roles:", error);
    res.status(500).json({ message: "Error al obtener roles." });
  }
});

app.get("/api/stats", verificarToken, soloAdmin, async (_req, res) => {
  try {
    const [
      [[{ casesThisMonth }]],
      [[{ casesResolved }]],
      [byType],
    ] = await Promise.all([
      pool.execute(
        `SELECT COUNT(*) AS casesThisMonth FROM incidents
         WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
           AND created_at <  DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')`,
      ),
      pool.execute(
        `SELECT COUNT(*) AS casesResolved FROM incidents WHERE status = 'resuelto'`,
      ),
      pool.execute(
        `SELECT type, COUNT(*) AS total FROM incidents GROUP BY type ORDER BY total DESC`,
      ),
    ]);
    res.json({ casesThisMonth, casesResolved, byType });
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas." });
  }
});

app.get("/api/users", verificarToken, soloAdmin, async (req, res) => {
  const { role, limit = "50", page = "1" } = req.query;
  const validRoles = ["admin", "user", "patrullero"];
  if (role && !validRoles.includes(String(role))) {
    return res.status(400).json({ message: "Rol inválido." });
  }

  const limitNum = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 50));
  const pageNum  = Math.max(1, parseInt(String(page), 10) || 1);
  const offset   = (pageNum - 1) * limitNum;

  try {
    const [rows] = role
      ? await pool.execute(
          `SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
                  r.id AS role_id, r.name AS role, r.display_name AS role_display
           FROM users u JOIN roles r ON r.id = u.role_id
           WHERE r.name = ? ORDER BY u.first_name
           LIMIT ${limitNum} OFFSET ${offset}`,
          [String(role)],
        )
      : await pool.execute(
          `SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
                  r.id AS role_id, r.name AS role, r.display_name AS role_display
           FROM users u JOIN roles r ON r.id = u.role_id
           ORDER BY r.name, u.first_name
           LIMIT ${limitNum} OFFSET ${offset}`,
        );
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
});

app.post("/api/assignments", verificarToken, soloAdmin, async (req, res) => {
  const { incidentId, patrulleroId } = req.body ?? {};
  if (!incidentId || !patrulleroId) {
    return res
      .status(400)
      .json({ message: "incidentId y patrulleroId son obligatorios." });
  }
  try {
    await pool.execute(
      `INSERT INTO assignments (incident_id, patrullero_id, status) VALUES (?, ?, 'asignado')
       ON DUPLICATE KEY UPDATE status = 'asignado', assigned_at = CURRENT_TIMESTAMP`,
      [incidentId, patrulleroId],
    );
    await pool.execute(
      "UPDATE incidents SET status = 'en_desarrollo' WHERE id = ? AND status = 'recibido'",
      [incidentId],
    );
    res.status(201).json({ message: "Patrullero asignado correctamente." });
  } catch (error) {
    console.error("Error al asignar:", error);
    res.status(500).json({ message: "Error al crear la asignación." });
  }
});

app.get("/api/incidents", verificarToken, async (req, res) => {
  const { status, mine, limit = "50", page = "1" } = req.query;

  const VALID_STATUSES = ["recibido", "en_desarrollo", "resuelto"];
  if (status && !VALID_STATUSES.includes(String(status))) {
    return res.status(400).json({ message: "Estado inválido." });
  }

  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 50));
  const pageNum  = Math.max(1, parseInt(String(page), 10) || 1);
  const offset   = (pageNum - 1) * limitNum;
  const onlyMine = mine === "true";

  const conditions = [];
  const params = [];
  if (status)   { conditions.push("i.status = ?");  params.push(String(status)); }
  if (onlyMine) { conditions.push("i.user_id = ?"); params.push(req.user.id); }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const [rows] = await pool.execute(`
      SELECT
        i.id, i.user_id, i.type, i.description, i.lat, i.lng,
        i.media_url, i.status, i.created_at, i.updated_at,
        u.first_name,
        u.last_name,
        p.first_name  AS patrullero_first_name,
        p.last_name   AS patrullero_last_name,
        a.status      AS assignment_status
      FROM incidents i
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN assignments a ON a.incident_id = i.id
      LEFT JOIN users p ON p.id = a.patrullero_id
      ${where}
      ORDER BY i.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo incidentes:", error);
    res.status(500).json({ message: "Error al obtener incidentes de la base de datos." });
  }
});

app.get("/api/incidents/my", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM incidents WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo mis incidentes:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.post("/api/incidents", verificarToken, async (req, res) => {
  const { type, description, lat, lng, media_url } = req.body ?? {};

  if (!type || !description || lat == null || lng == null) {
    return res
      .status(400)
      .json({ message: "Faltan campos obligatorios para el reporte." });
  }

  if (String(type).length > 100) {
    return res.status(400).json({ message: "El tipo de incidente no puede superar los 100 caracteres." });
  }
  if (String(description).length > 1000) {
    return res.status(400).json({ message: "La descripción no puede superar los 1000 caracteres." });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO incidents (user_id, type, description, lat, lng, media_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, type, description, lat, lng, media_url ?? null],
    );

    res.status(201).json({
      message: "Incidente reportado con éxito.",
      incidentId: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear incidente:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al crear el incidente." });
  }
});

app.put("/api/incidents/:id", verificarToken, soloAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body ?? {};

  const VALID_STATUSES = ["recibido", "en_desarrollo", "resuelto"];
  if (!status || !VALID_STATUSES.includes(String(status))) {
    return res.status(400).json({
      message: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}.`,
    });
  }

  try {
    const [result] = await pool.execute(
      "UPDATE incidents SET status = ? WHERE id = ?",
      [status, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incidente no encontrado." });
    }

    await pool.execute(
      "INSERT INTO incident_timeline (incident_id, description) VALUES (?, ?)",
      [id, `El estado del incidente fue actualizado a: ${status}`]
    );

    res.json({ message: "Estado del incidente actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar incidente:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.delete(
  "/api/incidents/:id",
  verificarToken,
  soloAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.execute(
        "DELETE FROM incidents WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Incidente no encontrado." });
      }

      res.json({ message: "Incidente eliminado correctamente." });
    } catch (error) {
      console.error("Error al eliminar incidente:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },
);

function soloPatrullero(req, res, next) {
  if (req.user?.role !== "patrullero") {
    return res
      .status(403)
      .json({ message: "Acceso restringido a patrulleros." });
  }
  next();
}

app.get(
  "/api/shifts/active",
  verificarToken,
  soloPatrullero,
  async (req, res) => {
    try {
      const [rows] = await pool.execute(
        "SELECT id, start_time, start_lat, start_lng FROM shifts WHERE patrullero_id = ? AND status = 'activo' LIMIT 1",
        [req.user.id],
      );
      res.json(rows[0] ?? null);
    } catch (error) {
      console.error("Error obteniendo turno activo:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },
);

app.post(
  "/api/shifts/start",
  verificarToken,
  soloPatrullero,
  async (req, res) => {
    const { lat, lng } = req.body ?? {};
    if (lat == null || lng == null) {
      return res
        .status(400)
        .json({ message: "Se requiere ubicación GPS para iniciar el turno." });
    }
    try {
      const [active] = await pool.execute(
        "SELECT id FROM shifts WHERE patrullero_id = ? AND status = 'activo' LIMIT 1",
        [req.user.id],
      );
      if (active.length > 0) {
        return res.status(409).json({
          message: "Ya tienes un turno activo.",
          shiftId: active[0].id,
        });
      }
      const [result] = await pool.execute(
        "INSERT INTO shifts (patrullero_id, status, start_lat, start_lng) VALUES (?, 'activo', ?, ?)",
        [req.user.id, lat, lng],
      );
      await pool.execute(
        "INSERT INTO gps_tracking (shift_id, lat, lng) VALUES (?, ?, ?)",
        [result.insertId, lat, lng],
      );
      res
        .status(201)
        .json({ message: "Turno iniciado.", shiftId: result.insertId });
    } catch (error) {
      console.error("Error iniciando turno:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },
);

app.post(
  "/api/shifts/:id/end",
  verificarToken,
  soloPatrullero,
  async (req, res) => {
    const shiftId = Number.parseInt(req.params.id, 10);
    const { lat, lng } = req.body ?? {};
    try {
      const [result] = await pool.execute(
        `UPDATE shifts SET status = 'finalizado', end_time = CURRENT_TIMESTAMP,
       end_lat = ?, end_lng = ? WHERE id = ? AND patrullero_id = ? AND status = 'activo'`,
        [lat ?? null, lng ?? null, shiftId, req.user.id],
      );
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Turno no encontrado o no te pertenece." });
      }
      res.json({ message: "Turno finalizado correctamente." });
    } catch (error) {
      console.error("Error finalizando turno:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },
);

app.post(
  "/api/shifts/:id/gps",
  verificarToken,
  soloPatrullero,
  async (req, res) => {
    const shiftId = Number.parseInt(req.params.id, 10);
    const { lat, lng } = req.body ?? {};
    if (lat == null || lng == null) {
      return res.status(400).json({ message: "lat y lng son obligatorios." });
    }
    try {
      const [rows] = await pool.execute(
        "SELECT id FROM shifts WHERE id = ? AND patrullero_id = ? AND status = 'activo' LIMIT 1",
        [shiftId, req.user.id],
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: "Turno activo no encontrado." });
      }
      await pool.execute(
        "INSERT INTO gps_tracking (shift_id, lat, lng) VALUES (?, ?, ?)",
        [shiftId, lat, lng],
      );
      res.status(201).json({ message: "Posición registrada." });
    } catch (error) {
      console.error("Error registrando GPS:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  },
);


app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body ?? {};

  if (!email || String(email).length > 254) {
    return res.status(400).json({ message: "El correo electrónico es obligatorio." });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  try {
    const [rows] = await pool.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [cleanEmail],
    );

    await bcrypt.hash("__timing_dummy__", 12);

    if (rows.length === 0) {
      return res.status(422).json({ message: "No existe una cuenta asociada a ese correo." });
    }

    res.json({ message: `Se ha enviado un enlace de recuperación a ${cleanEmail}.` });
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
