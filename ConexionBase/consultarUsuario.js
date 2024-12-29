// Cargar variables de entorno
require('dotenv').config();

// Importar la librería pg
const { Pool } = require('pg');

// Configurar conexión a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
      }
});

// Función para consultar la tabla 'usuario'
async function consultarUsuarios() {
    try {
        const query = 'SELECT * FROM usuario;';
        const result = await pool.query(query);

        console.log('Usuarios encontrados:');
        console.table(result.rows);
    } catch (err) {
        console.error('Error al consultar la tabla:', err.message);
    } finally {
        await pool.end();
    }
}

// Ejecutar la consulta
consultarUsuarios();
