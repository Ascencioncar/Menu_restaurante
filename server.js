const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(bodyParser.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta para manejar el login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log("Solicitud entrante:", { username, password });

    const users = JSON.parse(fs.readFileSync("users.json", "utf-8")).users;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        console.log("Usuario encontrado:", user);
        res.json({ success: true, rol: user.rol });
    } else {
        console.log("Credenciales incorrectas");
        res.json({ success: false, message: "Credenciales incorrectas" });
    }
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
