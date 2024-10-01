const connection = require('../db/db');
const validator = require('validator');
const { Resend } = require('resend');

const resend = new Resend("re_cUenmb13_7TN9yxDLx5RxjTciBDMadjVe");

// Enviar Correo
const enviarCorreo = async (req, res) => {
    try {
      const { to, subject, html } = req.body; 
  
      // Validaciones básicas
      if (!validator.isEmail(to)) {
        return res.status(400).json({ error: 'El correo electrónico es inválido.' });
      }
      if (!subject || !html) {
        return res.status(400).json({ error: 'El asunto y el contenido HTML son requeridos.' });
      }
  
      const { data, error } = await resend.emails.send({
        from: "Mediterrum <hey@mediterrum.site>",
        to: [to],
        subject: subject,
        html: html,
      });
  
      if (error) {
        return res.status(400).json({ error });
      }
  
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno al enviar el correo.' });
    }
};

// Obtener todos los usuarios
const obtenerUsuariosTodos = (req, res) => {
  const query = `CALL obtener_usuarios_todos()`;
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json(results);
  });
};

// Obtener un usuario
const obtenerUsuario = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const query = `CALL obtener_usuario(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener un usuario por parámetro
const obtenerUsuarioParametro = (req, res) => {
  const { param } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE nombre = ? OR email = ? OR telefono = ?';

  connection.query(checkQuery, [param, param, param], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const query = `CALL obtener_usuario_parametro(?)`;
    
    connection.query(query, [param], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener la red de un usuario
const obtenerUsuarioRed = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const query = `CALL obtener_usuario_red(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener las relaciones de un usuario
const obtenerUsuarioRelaciones = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const query = `CALL obtener_usuario_relaciones(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener los puntos trimestrales de un usuario
const obtenerUsuarioPuntosTrimestre = (req, res) => {
  const { id } = req.params;
  const { fecha } = req.body;

  const checkQuery = 'SELECT rol FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioRol = results[0].rol;
    if (usuarioRol !== 'distribuidor') {
      return res.status(400).json({ mensaje: 'Los puntos solo se acumulan para distribuidores.' });
    }

    const query = `CALL obtener_usuario_puntos_trimestre(?, ?)`;
    
    connection.query(query, [id, fecha], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener el distribuidor de un usuario
const obtenerUsuarioDistribuidor = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT rol FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioRol = results[0].rol;
    if (usuarioRol === 'distribuidor') {
      return res.status(400).json({ mensaje: 'Los distribuidores no tienen distribuidor.' });
    }

    const query = `CALL obtener_usuario_distribuidor(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener el vendedor de un usuario
const obtenerUsuarioVendedor = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT rol FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuarioRol = results[0].rol;
    if (usuarioRol === 'vendedor' || usuarioRol === 'distribuidor') {
      return res.status(400).json({ mensaje: 'Solo los promotores tienen vendedor.' });
    }

    const query = `CALL obtener_usuario_vendedor(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Obtener el historial de un usuario
const obtenerUsuarioHistorial = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const query = `CALL obtener_usuario_historial(?)`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).json(results);
    });
  });
};

// Insertar un usuario
const insertarUsuario = async (req, res) => {
    const { nombre, email, telefono, locacion, rol, puntos_total, nivel, id_distribuidor, id_vendedor, contrasena, id_creador } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'El formato del email no es válido' });
    }

    if (!validator.isMobilePhone(telefono, 'any', { strictMode: false })) {
        return res.status(400).json({ mensaje: 'El número de celular no es válido' });
    }

    const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE email = ? OR telefono = ?';

    connection.query(checkQuery, [email, telefono], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results[0].count > 0) {
            return res.status(400).json({ mensaje: 'El email o el número de celular ya está en uso' });
        }

        const query = `CALL insertar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        connection.query(query, [nombre, email, telefono, locacion, rol, puntos_total, nivel, id_distribuidor, id_vendedor, contrasena, id_creador], async (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }

            // Envío de correo electrónico
            const subject = 'Por favor, establece tu contraseña';
            const html = `Por favor, entra a este <a href="www.mediterrum.site">link</a> para agregar tu contraseña.`; // Ajusta el enlace según tu aplicación.

            try {
                const { data, error } = await resend.emails.send({
                    from: "Mediterrum <hey@mediterrum.site>",
                    to: [email],
                    subject: subject,
                    html: html,
                });

                if (error) {
                    console.error('Error al enviar el correo:', error);
                    return res.status(500).json({ mensaje: 'Usuario insertado, pero no se pudo enviar el correo.' });
                }

                console.log('Correo enviado:', data);
                res.status(201).json({ mensaje: 'Usuario insertado correctamente y correo enviado.' });
            } catch (emailError) {
                console.error('Error al enviar el correo:', emailError);
                return res.status(500).json({ mensaje: 'Usuario insertado, pero no se pudo enviar el correo.' });
            }
        });
    });
};

// Eliminar un usuario
const eliminarUsuario = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';
  
  connection.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results[0].count === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  
    const query = `CALL eliminar_usuario(?)`;

    connection.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json({mensaje: "Usuario eliminado correctamente"});
    });
  });
  };
  
// Modificar los datos de un usuario (actualización parcial)
const modificarUsuarioDatos = (req, res) => {
  const id = req.params.id;
  const { nuevoNombre, nuevoEmail, nuevoTelefono, nuevaLocacion } = req.body;

  if (isNaN(id)) {
      return res.status(400).json({ mensaje: 'ID inválido.' });
  }

  const query = `CALL modificar_usuario_datos(?, ?, ?, ?, ?)`;
  const values = [
      id,
      nuevoNombre || null || "",
      nuevoEmail || null || "",
      nuevoTelefono || null || "",
      nuevaLocacion || null || ""
  ];

  connection.query(query, values, (err, results) => {
      if (err) {
          return res.status(500).json({mensaje : err.sqlMessage});
      }
      res.status(200).json({ mensaje: `Datos de usuario con ID ${id} actualizados correctamente` });
  });
};

// Modificar el rol de un usuario
const modificarUsuarioRol = (req, res) => {
  const id = req.params.id;
  const { nuevoRol } = req.body;

  if (isNaN(id) || !['vendedor', 'promotor', 'distribuidor'].includes(nuevoRol)) {
    return res.status(400).json({ mensaje: 'ID inválido o rol no válido.' });
  }

  const checkCurrentRoleQuery = 'SELECT rol FROM usuarios WHERE id = ?';
  
  connection.query(checkCurrentRoleQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const currentRol = results[0].rol;

    if (currentRol === nuevoRol) {
      return res.status(400).json({ message: 'Ese rol ya está asignado al usuario.' });
    }

    const query = `CALL modificar_usuario_rol(?, ?)`;
  
    connection.query(query, [id, nuevoRol], (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.sqlMessage });
      }

      res.status(200).json({ mensaje: `Rol de usuario con ID ${id} actualizado a ${nuevoRol} correctamente.` });
    });
  });
};

// Modificar la contraseña de un usuario
const modificarUsuarioContrasena = (req, res) => {
  const id = req.params.id;
  const { nuevaContrasena } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ mensaje: 'ID inválido.' });
  }

  const checkUserQuery = `SELECT contrasena FROM usuarios WHERE id = ?`;
  
  connection.query(checkUserQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const currentPassword = results[0].contrasena;

    if (currentPassword === nuevaContrasena) {
      return res.status(400).json({ mensaje: 'La nueva contraseña no puede ser la misma que la actual.' });
    }

    const query = `CALL modificar_usuario_contrasena(?, ?)`;
    const values = [id, nuevaContrasena];

    connection.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ mensaje: err.sqlMessage });
      }
      res.status(200).json({ mensaje: `Contraseña de usuario con ID ${id} actualizada correctamente` });
    });
  });
};

// Modificar el vendedor de un usuario
const modificarUsuarioVendedor = (req, res) => {
  const usuario_id = req.params.id;
  const { nuevoVendedor } = req.body;

  if (isNaN(usuario_id) || (nuevoVendedor !== null && isNaN(nuevoVendedor))) {
    return res.status(400).json({ mensaje: 'ID inválido.' });
  }

  if (nuevoVendedor === null) {
    return res.status(400).json({ mensaje: 'El nuevo vendedor debe ser proporcionado.' });
  }

  const checkUsuarioQuery = `SELECT rol FROM usuarios WHERE id = ?`;
  connection.query(checkUsuarioQuery, [usuario_id], (err, usuarioResults) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (usuarioResults.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const usuarioRol = usuarioResults[0].rol;
    if (usuarioRol !== 'promotor') {
      return res.status(400).json({ mensaje: 'El vendedor solo puede ser asignado a un promotor.' });
    }

    const checkVendedorQuery = `SELECT 1 FROM usuarios WHERE id = ? AND rol = 'vendedor'`;
    connection.query(checkVendedorQuery, [nuevoVendedor], (err, vendedorResults) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (vendedorResults.length === 0) {
        return res.status(404).json({ mensaje: 'Vendedor no encontrado.' });
      }

      const query = `CALL modificar_usuario_vendedor(?, ?)`;
      const values = [usuario_id, nuevoVendedor];

      connection.query(query, values, (err, results) => {
        if (err) {
          return res.status(400).json({ mensaje: err.sqlMessage });
        }
        res.status(200).json({ mensaje: `Vendedor del usuario con ID ${usuario_id} actualizado correctamente` });
      });
    });
  });
};

// Modificar el distribuidor de un vendedor
const modificarUsuarioDistribuidor = (req, res) => {
    const usuario_id = req.params.id;
    const { nuevoDistribuidor } = req.body;

    // Validar que los IDs sean números válidos
    if (isNaN(usuario_id) || (nuevoDistribuidor !== null && isNaN(nuevoDistribuidor))) {
        return res.status(400).json({ mensaje: 'ID inválido.' });
    }

    // Verificar que el nuevo distribuidor no sea null
    if (nuevoDistribuidor === null) {
        return res.status(400).json({ mensaje: 'El nuevo distribuidor debe ser proporcionado.' });
    }

    // Consulta para verificar el rol del usuario
    const checkUsuarioQuery = `SELECT rol FROM usuarios WHERE id = ?`;
    connection.query(checkUsuarioQuery, [usuario_id], (err, usuarioResults) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Verificar que el usuario exista
        if (usuarioResults.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        // Verificar que el rol sea vendedor
        const usuarioRol = usuarioResults[0].rol;
        if (usuarioRol === 'distribuidor') {
            return res.status(400).json({ mensaje: 'El distribuidor no puede ser asignado a un distribuidor.' });
        }

        // Consulta para verificar que el nuevo distribuidor existe
        const checkDistribuidorQuery = `SELECT 1 FROM usuarios WHERE id = ? AND rol = 'distribuidor'`;
        connection.query(checkDistribuidorQuery, [nuevoDistribuidor], (err, distribuidorResults) => {
            if (err) {
                return res.status(500).send(err);
            }

            // Verificar que el distribuidor exista
            if (distribuidorResults.length === 0) {
                return res.status(404).json({ mensaje: 'Distribuidor no encontrado.' });
            }

            // Llamar al procedimiento almacenado para modificar el distribuidor
            const query = `CALL modificar_usuario_distribuidor(?, ?)`;
            const values = [usuario_id, nuevoDistribuidor];

            connection.query(query, values, (err, results) => {
                if (err) {
                    return res.status(400).json({ mensaje: err.sqlMessage });
                }
                res.status(200).json({ mensaje: `Distribuidor del vendedor con ID ${usuario_id} actualizado correctamente` });
            });
        });
    });
};

// Reiniciar los puntos y nivel de los distribuidores
const reiniciarPuntosNivel = (req, res) => {
  const query = `CALL reset_usuarios_puntos_nivel()`;
  
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({mensaje:"Los puntos y nivel de los distribuidores han sido reiniciados correctamente"});
  });

}


module.exports = {
    enviarCorreo,
    insertarUsuario,
    obtenerUsuariosTodos,
    obtenerUsuario,
    obtenerUsuarioParametro,
    obtenerUsuarioRed,
    obtenerUsuarioRelaciones,
    obtenerUsuarioPuntosTrimestre,
    obtenerUsuarioDistribuidor,
    obtenerUsuarioVendedor,
    obtenerUsuarioHistorial,
    eliminarUsuario,
    modificarUsuarioDatos,
    modificarUsuarioRol,
    modificarUsuarioContrasena,
    modificarUsuarioVendedor,
    modificarUsuarioDistribuidor,
    reiniciarPuntosNivel
};