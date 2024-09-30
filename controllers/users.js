// controllers/users.js
const connection = require('../db/db');
const validator = require('validator');

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
  
    // Validar email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ mensaje: 'El formato del email no es válido' });
    }
  
    // Validar teléfono (solo revisa si tiene caracteres válidos para un teléfono, sin formato internacional)
    if (!validator.isMobilePhone(telefono, 'any', { strictMode: false })) {
      return res.status(400).json({ mensaje: 'El número de celular no es válido' });
    }
  
    // Verificar unicidad del email y teléfono
    const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE email = ? OR telefono = ?';
  
    connection.query(checkQuery, [email, telefono], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      if (results[0].count > 0) {
        return res.status(400).json({ mensaje: 'El email o el número de celular ya está en uso' });
      }
  
      // Si pasa las validaciones, proceder con la inserción
      const query = `CALL insertar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      connection.query(query, [nombre, email, telefono, locacion, rol, puntos_total, nivel, id_distribuidor, id_vendedor, contrasena, id_creador], (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(201).json({ mensaje: 'Usuario insertado correctamente' });
      });
    });
  };

// Eliminar un usuario
const eliminarUsuario = (req, res) => {
    const { id } = req.params;
  
    const query = `CALL eliminar_usuario(?)`;
  
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      // Comprobar si se eliminó alguna fila
      const affectedRows = results?.[0]?.affectedRows || 0; // MySQL retorna las filas afectadas dentro de 'results'
  
      if (affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    });
  };
  
  

  module.exports = {
    insertarUsuario,
    obtenerUsuarios,
    eliminarUsuario
  };