require('dotenv').config(); // Carga las variables de entorno

const { Pool } = require('pg');

// Configura los detalles de tu conexión con variables del archivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Conexión exitosa a PostgreSQL");
    client.release();
  } catch (err) {
    console.error("Error al conectar a PostgreSQL:", err);
  }
};

module.exports = {
  pool,
  testConnection
};

testConnection(); // Prueba la conexión al cargar el módulo

