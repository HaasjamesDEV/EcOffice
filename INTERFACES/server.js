const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
console.log("🚨 ESTOY EJECUTANDO ESTE ARCHIVO DE SERVIDOR 🚨");

app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "ecoffice",  // Cambia según tu configuración
  password: "ecoffice123",  // Si tienes contraseña, agrégala aquí
  database: "ecoffice"  // Cambia según tu configuración
});

db.connect(err => {
  if (err) throw err;
  console.log("Conectado a MySQL");
});

// Ruta para obtener usuarios
/*
app.get("/usuario", (req, res) => {
  db.query("SELECT * FROM usuario", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});*/

// Ruta para agregar un usuario

app.post("/usuario", (req, res) => {
  console.log("Se ha llamado a POST /usuario");

  const { nombre, correo, contrasenia } = req.body;
  console.log("Datos recibidos en el servidor:", { nombre, correo, contrasenia });

  db.query(
    "INSERT INTO usuario (nombre, correo, contrasenia) VALUES (?, ?, ?)", 
    [nombre, correo, contrasenia], 
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Usuario agregado", id: result.insertId });
    }
  );
});



/*app.post("/usuario", (req, res) => {
  const { nombre, correo, contrasenia } = req.body;
  db.query("INSERT INTO usuario (nombre, correo, contrasenia) VALUES (?, ?, ?)", [nombre, correo, contrasenia], (err, result) => {
    if (err) throw err;
    res.json({ message: "Usuario agregado", id: result.insertId });
  });
});*/

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

// Ruta para la raíz del servidor
app.get("/", (req, res) => {
  res.send("Servidor corriendo en http://localhost:3000");
});

app.get("/usuario/verify", (req, res) => {
  const correo = req.query.correo;
  db.query("SELECT * FROM usuario WHERE correo = ?", [correo], (err, result) => {
    if (err) {
      console.error("Error en la consulta MySQL:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json({ exists: result.length > 0 });
  });
});