const { get } = require('express/lib/response');
const { Pool } = require('pg');
require('dotenv').config(); // Para leer el archivo .env

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.PG_USER, // Usuario de la base de datos
    host: process.env.PG_HOST, // Host del servidor
    database: process.env.PG_DATABASE, // Nombre de la base de datos
    password: process.env.PG_PASSWORD, // Contraseña
    port: process.env.PG_PORT, // Puerto de conexión
    ssl: {
        rejectUnauthorized: false,
      },

});

// Función para consultar la tabla "usuario"
async function getUsuarios() {
    try {
        const result = await pool.query('SELECT * FROM usuario');
        return result.rows; // Devuelve un array con los registros
    } catch (error) {
        console.error('Error al consultar la tabla usuario:', error);
        throw error; // Lanza el error para manejarlo en otros niveles
    }
}

// Exportar la función para usarla en otras partes del proyecto
module.exports = { getUsuarios };

async function getPedidos() {
    try {
        const result = await pool.query('SELECT * FROM pedidos');
        return result.rows; // Devuelve un array con los registros
    } catch (error) {
        console.error('Error al consultar la tabla usuario:', error);
        throw error; // Lanza el error para manejarlo en otros niveles
    }
}



(async () => {
    try {
        const usuarios = await getUsuarios();
        console.log('Usuarios:', usuarios);
    } catch (error) {
        console.error('Error durante la prueba:', error);
    }
})();

(async () => {
    try {
        const Pedidos = await getPedidos();
        console.log('Pedidos:', Pedidos);
    } catch (error) {
        console.error('Error durante la prueba:', error);
    }
})();