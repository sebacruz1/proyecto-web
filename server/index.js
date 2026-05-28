import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const app = express();
const port = Number(process.env.PORT ?? 3001);

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "santodomingo",
  password: process.env.DB_PASSWORD ?? "santodomingo",
  database: process.env.DB_NAME ?? "muni_sd",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(cors());
app.use(express.json());

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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ message: "Email y contraseña son obligatorios." });
    return;
  }
  try{

    const [rows] = await pool.execute(
      "SELECT id, email, role, password, first_name, last_name, rut, address FROM users WHERE email = ? LIMIT 1",
      [String(email).trim().toLowerCase()],
    );

    const user = rows[0];

    if (!user || user.password !== password) {
      res.status(401).json({ message: "Credenciales incorrectas." });
      return;
    }
    const secretKey = process.env.JWT_SECRET ?? "curanto";
    const token = jwt.sign(
      {id: user.id, role: user.role, email: user.email},
      secretKey,
      { expiresIn: "8h"}
    );

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      rut: user.rut,
      address: user.address,
      message: "Login correcto.",
    });
} catch (error){
  console.error("Error en login", error);
  res.status(500).json({message: "Error interno del servidor."});
}
});

// Middleware para verificar el Token
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET ?? "super_secreto_desarrollo_2026";
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Guardamos los datos del usuario en la request
    next(); // Permitimos que la petición continúe hacia el endpoint
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

app.get("/api/incidents", async (req, res) => {
  try {
    // Obtenemos los incidentes y hacemos un JOIN para traer el nombre del usuario (si no es anónimo)
    const [rows] = await pool.execute(`
      SELECT 
        i.*,
        u.first_name,
        u.last_name
      FROM incidents i
      LEFT JOIN users u ON i.user_id = u.id
      ORDER BY i.created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo incidentes:", error);
    res.status(500).json({ message: "Error al obtener incidentes de la base de datos." });
  }
});

app.post("/api/incidents", verificarToken,async (req, res) => {
  const { user_id, type, description, lat, lng, is_anonymous, media_url } = req.body;

  // Validación básica requerida en EP 2.3
  if (!type || !description || !lat || !lng) {
    return res.status(400).json({ message: "Faltan campos obligatorios para el reporte." });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO incidents (user_id, type, description, lat, lng, is_anonymous, media_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, type, description, lat, lng, is_anonymous || false, media_url || null]
    );

    res.status(201).json({ 
      message: "Incidente reportado con éxito.",
      incidentId: result.insertId 
    });
  } catch (error) {
    console.error("Error al crear incidente:", error);
    res.status(500).json({ message: "Error interno del servidor al crear el incidente." });
  }
});

app.put("/api/incidents/:id", verificarToken,async (req, res) => {
  const { id } = req.params; // Viene en la URL
  const { status } = req.body; // Viene desde el frontend

  if (!status) {
    return res.status(400).json({ message: "El nuevo estado es obligatorio." });
  }

  try {
    const [result] = await pool.execute(
      "UPDATE incidents SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incidente no encontrado." });
    }

    res.json({ message: "Estado del incidente actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar incidente:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.delete("/api/incidents/:id", verificarToken,async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM incidents WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Incidente no encontrado." });
    }

    res.json({ message: "Incidente eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar incidente:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});



app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
