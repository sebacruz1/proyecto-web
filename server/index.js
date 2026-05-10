import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

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

  const [rows] = await pool.execute(
    "SELECT id, email, role, password FROM users WHERE email = ? LIMIT 1",
    [String(email).trim().toLowerCase()],
  );

  const user = rows[0];

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Credenciales incorrectas." });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    message: "Login correcto.",
  });
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
