import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DB = {
  host:     process.env.DB_HOST     ?? "127.0.0.1",
  port:     Number(process.env.DB_PORT ?? 3306),
  user:     process.env.DB_ROOT_USER ?? "root",
  password: process.env.DB_ROOT_PASS ?? "root",
};
const DB_NAME = process.env.DB_NAME ?? "muni_sd";
const DB_USER = process.env.DB_USER ?? "santodomingo";
const DB_PASS = process.env.DB_PASSWORD ?? "santodomingo";

const conn = await createConnection({ ...DB, multipleStatements: true });

console.log("Recreando base de datos...");
await conn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
await conn.query(`CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
await conn.query(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%'`);
await conn.query(`USE \`${DB_NAME}\``);

console.log("Aplicando schema...");
await conn.query(readFileSync(join(__dirname, "schema.sql"), "utf8"));

console.log("Aplicando seed...");
await conn.query(readFileSync(join(__dirname, "seed.sql"), "utf8"));

await conn.end();
console.log("Listo. Base de datos reiniciada correctamente.");
