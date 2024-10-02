const connection = require('../db/db');
const validator = require('validator');

// Insertar un cliente
const insertarCliente = async (req, res) => {
    const { usuario, nombre, email, telefono, locacion, intereses } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'El formato del email no es válido' });
    }

    if (!validator.isMobilePhone(telefono, 'any', { strictMode: false })) {
        return res.status(400).json({ mensaje: 'El número de celular no es válido' });
    }

    const checkUsuarioQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';

    connection.query(checkUsuarioQuery, [usuario], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results[0].count === 0) {
            return res.status(404).json({ mensaje: 'El usuario creador no existe' });
        }

        const checkClienteQuery = 'SELECT COUNT(*) as count FROM clientes WHERE telefono = ? OR email = ?';

        connection.query(checkClienteQuery, [telefono, email], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (results[0].count > 0) {
                return res.status(400).json({ mensaje: 'El cliente ya existe' });
            }

            const query = `CALL insertar_cliente(?, ?, ?, ?, ?, ?)`;

            connection.query(query, [usuario, nombre, email, telefono, locacion, intereses], (err, results) => {
                if (err) {
                    if (err.sqlState === '45000') {
                        return res.status(400).json({ mensaje: err.sqlMessage });
                    }
                    return res.status(500).send(err);
                }

                res.status(201).json({ mensaje: 'Cliente insertado correctamente' });
            });
        });
    });
};

// Obtener todos los clientes
const obtenerClientesTodos = (req, res) => {
    const query = `CALL obtener_clientes_todos()`;
    
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
};

// Obtener un cliente por ID
const obtenerCliente = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM clientes WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const query = `CALL obtener_cliente(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener un cliente por parametro
const obtenerClienteParametro = (req, res) => {
  const { param } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM clientes WHERE nombre = ? OR email = ? OR telefono = ?';

  connection.query(checkQuery, [param, param, param], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const query = `CALL obtener_cliente_parametro(?)`;
    
    connection.query(query, [param], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener un cliente por el nombre de su usuario
const obtenerClienteUsuario = (req, res) => {
  const { usuario } = req.params;

  if (!usuario) {
    return res.status(400).json({ mensaje: 'El usuario es requerido' });
  }

  const checkUsuarioQuery = 'SELECT id FROM usuarios WHERE nombre = ? LIMIT 1';

  connection.query(checkUsuarioQuery, [usuario], (err, usuarioResults) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (usuarioResults.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const checkClienteQuery = 'SELECT COUNT(*) as count FROM clientes WHERE usuario = ?';

    connection.query(checkClienteQuery, [usuarioResults[0].id], (err, clienteResults) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (clienteResults[0].count === 0) {
        return res.status(404).json({ mensaje: `El usuario ${usuario} no tiene clientes` });
      }

      const query = `CALL obtener_cliente_por_usuario(?)`;
      
      connection.query(query, [usuario], (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(201).json(results);
      });
    });
  });
};

// Eliminar un cliente
const eliminarCliente = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM clientes WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const query = `CALL eliminar_cliente(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json({ mensaje: 'Cliente eliminado correctamente' });
    });
  });
};

// Modificar un cliente
const modificarCliente = (req, res) => {
  const cliente_id = req.params.id;
  const { nombre, email, telefono, locacion, intereses } = req.body;

  // Validar email
  if (!validator.isEmail(email)) {
      return res.status(400).json({ mensaje: 'El formato del email no es válido' });
  }

  // Validar teléfono
  if (!validator.isMobilePhone(telefono, 'any', { strictMode: false })) {
      return res.status(400).json({ mensaje: 'El número de celular no es válido' });
  }

  // Verificar que el cliente existe
  const checkClienteQuery = 'SELECT COUNT(*) as count FROM clientes WHERE id = ?';
  
  connection.query(checkClienteQuery, [cliente_id], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }

      if (results[0].count === 0) {
          return res.status(404).json({ mensaje: 'El cliente no existe' });
      }

      // Verificar que el email y el teléfono no estén en uso por otro cliente
      const checkUniqueQuery = 'SELECT COUNT(*) as count FROM clientes WHERE (email = ? OR telefono = ?) AND id != ?';
      
      connection.query(checkUniqueQuery, [email, telefono, cliente_id], (err, results) => {
          if (err) {
              return res.status(500).send(err);
          }

          if (results[0].count > 0) {
              return res.status(400).json({ mensaje: 'El email o teléfono ya están en uso por otro cliente' });
          }

          // Llamar al procedimiento almacenado para modificar el cliente
          const query = `CALL modificar_cliente(?, ?, ?, ?, ?, ?)`;
          const values = [cliente_id, nombre, email, telefono, locacion, intereses];

          connection.query(query, values, (err, results) => {
              if (err) {
                  if (err.sqlState === '45000') {
                      return res.status(400).json({ mensaje: err.sqlMessage });
                  }
                  return res.status(500).send(err);
              }
              res.status(200).json({ mensaje: `Cliente con ID ${cliente_id} modificado correctamente` });
          });
      });
  });
};


module.exports = {
    insertarCliente,
    obtenerClientesTodos,
    obtenerCliente,
    obtenerClienteParametro,
    obtenerClienteUsuario,
    eliminarCliente,
    modificarCliente
};

