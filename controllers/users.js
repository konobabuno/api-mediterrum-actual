const connection = require('../db/db');
const validator = require('validator');
const { Resend } = require('resend');
const xlsx = require('xlsx');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const resend = new Resend(process.env.MAIL_KEY);


const loginUsuario = (req, res) => {
  const { email, contrasena } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND contrasena = ?';

  connection.query(query, [email, contrasena], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }

      if (results.length === 0) {
          return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
      }

      const usuario = results[0];

      // Generar el token JWT
      const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.SECRET_KEY, { expiresIn: '8h' });

      // Enviar el token y el id del usuario en la respuesta
      res.status(200).json({ mensaje: 'Login exitoso', token, id: usuario.id });
  });
};



// Obtener usuarios y generar un archivo Excel
const getUsuariosExcel = (req, res) => {
    const query = 'SELECT id, nombre, email, telefono, locacion, rol, puntos_total, nivel FROM usuarios';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al obtener los datos', error: err.sqlMessage });
        }

        // Crear un nuevo libro de trabajo y hoja
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(results);

        // Agregar la hoja al libro
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

        // Generar el archivo Excel
        const excelFileName = `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`;
        xlsx.writeFile(workbook, excelFileName);

        // Enviar el archivo como respuesta
        res.download(excelFileName, (err) => {
            if (err) {
                console.error('Error al descargar el archivo', err);
            }
            // Opcional: Eliminar el archivo después de enviarlo
            fs.unlinkSync(excelFileName);
        });
    });
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

    const insertQuery = `CALL insertar_usuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(insertQuery, [nombre, email, telefono, locacion, rol, puntos_total, nivel, id_distribuidor, id_vendedor, contrasena, id_creador], (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Consulta para obtener el ID del usuario recién insertado por su email
      const getUserIdQuery = 'SELECT id FROM usuarios WHERE email = ?';

      connection.query(getUserIdQuery, [email], async (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }

        if (results.length === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado después de la inserción' });
        }

        const usuarioId = results[0].id;
        console.log(usuarioId);

        // Generar el token JWT
        const token = jwt.sign({ id: usuarioId, rol: rol }, process.env.SECRET_KEY, { expiresIn: '8h' });

        // Envío de correo electrónico
        const subject = 'Bienvenido a Mediterrum';
        const html = `Bienvenido a Mediterrum, gracias por ser parte de nuestra gran Familia.
        <br>
        Por favor, ingresa o cambia tu contraseña en este link: 
        <a href="https://mediterrum.site/password.html?token=${token}&id=${usuarioId}">
        Cambiar o ingresar contraseña
        </a>`;

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
          res.status(201).json({ mensaje: 'Usuario insertado correctamente y correo enviado.', token });
        } catch (emailError) {
          console.error('Error al enviar el correo:', emailError);
          return res.status(500).json({ mensaje: 'Usuario insertado, pero no se pudo enviar el correo.' });
        }
      });
    });
  });
};

const eliminarUsuario = (req, res) => {
  const { id } = req.params;

  const checkQuery = 'SELECT COUNT(*) as count FROM usuarios WHERE id = ?';

  connection.query(checkQuery, [id], (err, results) => {
      if (err) return res.status(500).send(err);

      if (results[0].count === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      // Obtener el carrito del usuario y actualizarlo a NULL
      const carritoNullQuery = 'UPDATE carrito SET usuario = NULL WHERE usuario = ?';

      connection.query(carritoNullQuery, [id], (err) => {
          if (err) return res.status(500).send(err);

          // Eliminar los productos del carrito
          const carritoProductoQuery = `
              DELETE carrito_producto
              FROM carrito_producto
              JOIN carrito ON carrito_producto.carrito = carrito.id
              WHERE carrito.usuario IS NULL`;

          connection.query(carritoProductoQuery, (err) => {
              if (err) return res.status(500).send(err);

              // Eliminar historial del usuario
              const historialQuery = 'DELETE FROM historial WHERE usuario = ?';

              connection.query(historialQuery, [id], (err) => {
                  if (err) return res.status(500).send(err);

                  // Finalmente, llamar al procedimiento para eliminar el usuario
                  const deleteUsuarioQuery = 'CALL eliminar_usuario(?)';

                  connection.query(deleteUsuarioQuery, [id], (err) => {
                      if (err) return res.status(500).send(err);
                      return res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
                  });
              });
          });
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

    // Validar que todos los campos estén presentes
    if (nuevoNombre === undefined || nuevoEmail === undefined || nuevoTelefono === undefined || nuevaLocacion === undefined) {
        return res.status(400).json({ mensaje: 'Todos los campos (nuevoNombre, nuevoEmail, nuevoTelefono, nuevaLocacion) son requeridos.' });
    }

    const query = `CALL modificar_usuario_datos(?, ?, ?, ?, ?)`;
    const values = [
        id,
        nuevoNombre,  // Se usa el nuevoNombre tal cual
        nuevoEmail,   // Se usa el nuevoEmail tal cual
        nuevoTelefono,// Se usa el nuevoTelefono tal cual
        nuevaLocacion // Se usa la nuevaLocacion tal cual
    ];

    connection.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: err.sqlMessage });
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
  
      // Si el rol actual es el mismo que el nuevo rol, simplemente no hacemos nada
      if (currentRol === nuevoRol) {
        return res.status(200).json({ mensaje: 'El usuario ya tiene ese rol asignado.' });
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

// Reestablecer la contraseña de un usuario
const reestablecerUsuarioContrasena = async (req, res) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
      return res.status(400).json({ mensaje: 'El formato del email no es válido' });
  }

  const checkQuery = 'SELECT id, rol FROM usuarios WHERE email = ?';
  connection.query(checkQuery, [email], async (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }

      if (results.length === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      const usuarioId = results[0].id;
      const rol = results[0].rol;
      const token = jwt.sign({ id: usuarioId, rol: rol }, process.env.SECRET_KEY, { expiresIn: '8h' });

      const subject = 'Restablecer contraseña';
      const html = `
          <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el enlace de abajo para restablecerla:</p>
          <a href="https://mediterrum.site/password.html?token=${token}&id=${usuarioId}">Restablecer contraseña</a>
          <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
      `;

      try {
          const { data, error } = await resend.emails.send({
              from: "Mediterrum <hey@mediterrum.site>",
              to: [email],
              subject: subject,
              html: html,
          });

          if (error) {
              return res.status(500).json({ mensaje: 'Error al enviar el correo de restablecimiento de contraseña.' });
          }
          res.status(200).json({ mensaje: 'Correo de restablecimiento de contraseña enviado.' });
      } catch (emailError) {
          return res.status(500).json({ mensaje: 'Error al enviar el correo de restablecimiento de contraseña.' });
      }
  });
};


module.exports = {
    loginUsuario,
    getUsuariosExcel,
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
    reiniciarPuntosNivel,
    reestablecerUsuarioContrasena
};