// controllers/users.js
const connection = require('../db/db');

// Obtener todos los usuarios
const obtenerUsuarios = (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  };
  

// Insertar un nuevo usuario
const insertarUsuario = (req, res) => {
  const { nombre, email, telefono, locacion, rol, puntos_total, nivel, id_distribuidor, id_vendedor, contrasena, id_creador } = req.body;

  const query = `CALL insertar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [nombre, email, telefono, locacion, rol, puntos_total, nivel, id_distribuidor, id_vendedor, contrasena, id_creador], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ mensaje: 'Usuario insertado correctamente' });
  });
};

module.exports = {
    insertarUsuario,
    obtenerUsuarios
};