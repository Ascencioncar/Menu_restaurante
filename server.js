const express = require('express');
const { get } = require('express/lib/response');
const { post } = require('express/lib/response');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de conexión a PostgreSQL
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

// Ruta principal para servir login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Ruta para autenticar al usuario
app.post('/login', async (req, res) => {
    const { nombre, contraseña } = req.body;

    try {
        // Consulta para verificar credenciales
        const result = await pool.query(
            'SELECT id, nombre FROM usuario WHERE nombre = $1 AND contraseña = $2',
            [nombre, contraseña]
        );

        if (result.rows.length > 0) {
            // Usuario encontrado
            const user = result.rows[0];
            res.json({
                success: true,
                message: 'Login exitoso',
                id: user.id,
                nombre: user.nombre,
            });
        } else {
            // Credenciales incorrectas
            res.status(401).json({ success: false, message: 'Error de credenciales' });
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


app.post('/guardar-pedido', async (req, res) => {
    const { mesa, cliente, items, total, comentario } = req.body;

    if (!Array.isArray(items) || items.some(item => !item.nombre || !item.cantidad)) {
        return res.status(400).json({ success: false, message: 'Estructura de items inválida' });
    }

    try {
        const fecha = new Date();
        const query = `
            INSERT INTO pedidos (mesa, cliente, items, total, comentario, fecha_pedido)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `;
        const values = [mesa, cliente, JSON.stringify(items), total, comentario, fecha];

        const result = await pool.query(query, values);
        res.json({ success: true, message: 'Pedido guardado exitosamente', id: result.rows[0].id });
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
        res.status(500).json({ success: false, message: 'Error al guardar el pedido' });
    }
});



// Simulación del endpoint en server.js
app.get('/api/pedidos', async (req, res) => {
    try {
        const query = `
            SELECT id, mesa, cliente, items, total, comentario, fecha_pedido AS fecha, estado
            FROM pedidos
            ORDER BY fecha_pedido DESC
        `;
        const result = await pool.query(query);

        // Verificar y procesar items correctamente
        const pedidos = result.rows.map(pedido => ({
            ...pedido,
            items: typeof pedido.items === 'string' ? JSON.parse(pedido.items || '[]') : pedido.items,
        }));

        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error); // Registrar el error exacto
        res.status(500).json({ success: false, message: 'Error interno del servidor al obtener los pedidos.' });
    }
});



// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
