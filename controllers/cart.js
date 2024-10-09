const connection = require('../db/db');
const validator = require('validator');

// Agregar producto al carrito
const agregarProductoCarrito = async (req, res) => {
    const { usuario_id, producto_sku, cantidad } = req.body;

    if (typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ mensaje: 'La cantidad debe ser un número positivo.' });
    }

    const query = `CALL insertar_producto_carrito(?, ?, ?)`;

    connection.query(query, [usuario_id, producto_sku, cantidad], (err, results) => {
        if (err) {
            if (err.sqlState === '45000') {
                return res.status(400).json({ mensaje: err.sqlMessage });
            }
            return res.status(500).send(err);
        }

        res.status(200).json({ mensaje: `Producto ${producto_sku} agregado al carrito con éxito.` });
    });
};

// Obtener productos en el carrito de un usuario
const obtenerProductosEnCarrito = async (req, res) => {
    const { usuario_id } = req.params;

    const query = `CALL obtener_productos_en_carrito_usuario(?)`;

    connection.query(query, [usuario_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).json(results[0]);
    });
};

// Modificar la cantidad de productos en un carrito
const modificarCantidadProductoCarrito = async (req, res) => {
    const { usuario_id, producto_sku, nueva_cantidad } = req.body;

    const query = `CALL modificar_cantidad_producto_carrito(?, ?, ?)`;

    connection.query(query, [usuario_id, producto_sku, nueva_cantidad], (err, results) => {
        if (err) {
            if (err.sqlState === '45000') {
                return res.status(400).json({ mensaje: err.sqlMessage });
            }
            return res.status(500).send(err);
        }

        res.status(200).json({ mensaje: 'Cantidad modificada correctamente' });
    });
};

// Eliminar un producto de un carrito
const eliminarProductoCarrito = async (req, res) => {
    const { usuario_id, producto_sku } = req.body;

    const query = `CALL eliminar_producto_carrito(?, ?)`;

    connection.query(query, [usuario_id, producto_sku], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).json({ mensaje: 'Producto eliminado del carrito correctamente' });
    });
};



module.exports = {
    agregarProductoCarrito,
    obtenerProductosEnCarrito,
    modificarCantidadProductoCarrito,
    eliminarProductoCarrito 
};
