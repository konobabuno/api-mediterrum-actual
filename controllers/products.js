const connection = require('../db/db');
const validator = require('validator');

// Insertar un producto
const insertarProducto = async (req, res) => {
    const { sku, nombre_producto, costo_total, costo_no_iva, img, descripcion, descuento, puntos_producto, cantidad_inventario } = req.body;

    // Validar campos obligatorios
    if (!sku || !nombre_producto || !costo_total || !costo_no_iva || !cantidad_inventario) {
        return res.status(400).json({ mensaje: 'Campos obligatorios faltantes' });
    }

    // Validar que costo_total y costo_no_iva sean números positivos
    if (isNaN(costo_total) || costo_total <= 0 || isNaN(costo_no_iva) || costo_no_iva <= 0) {
        return res.status(400).json({ mensaje: 'Costos deben ser números positivos' });
    }

    // Validar que cantidad_inventario sea un número positivo
    if (isNaN(cantidad_inventario) || cantidad_inventario < 0) {
        return res.status(400).json({ mensaje: 'Cantidad en inventario debe ser un número positivo o cero' });
    }

    // Validar que el descuento sea un número válido si existe
    if (descuento && (isNaN(descuento) || descuento < 0)) {
        return res.status(400).json({ mensaje: 'Descuento debe ser un número válido o no debe estar presente' });
    }

    // Verificar si el SKU ya existe en la base de datos
    const checkProductoQuery = 'SELECT COUNT(*) as count FROM productos WHERE sku = ?';

    connection.query(checkProductoQuery, [sku], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results[0].count > 0) {
            return res.status(400).json({ mensaje: 'El producto con este SKU ya existe' });
        }

        // Llamar al procedimiento almacenado para insertar el producto
        const query = `CALL insertar_producto(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            sku,
            nombre_producto,
            costo_total,
            costo_no_iva,
            img || null, // Si no se proporciona img, se inserta como NULL
            descripcion || null, // Si no se proporciona descripción, se inserta como NULL
            descuento || 0, // Si no se proporciona descuento, se inserta como 0
            puntos_producto || 0, // Si no se proporcionan puntos, se insertan como 0 para aplicar la lógica de IFNULL en el procedimiento almacenado
            cantidad_inventario
        ];

        connection.query(query, values, (err, results) => {
            if (err) {
                if (err.sqlState === '45000') {
                    return res.status(400).json({ mensaje: err.sqlMessage });
                }
                return res.status(500).send(err);
            }

            res.status(201).json({ mensaje: 'Producto insertado correctamente' });
        });
    });
};


// Obtener todos los productos
const obtenerProductosTodos = (req, res) => {
    const query = `CALL obtener_productos_todos()`;

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Verificar si hay resultados
        if (results[0].length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron productos' });
        }

        // Enviar los productos obtenidos
        res.status(200).json(results[0]);
    });
};

// Obtener un producto por SKU
const obtenerProductoPorSKU = (req, res) => {
    const { sku } = req.params;

    const query = `CALL obtener_producto(?)`;

    connection.query(query, [sku], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Verificar si se encontró el producto
        if (results[0].length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        // Enviar el producto encontrado
        res.status(200).json(results[0][0]);
    });
};

// Modificar los datos de un producto
const modificarProducto = (req, res) => {
    const { sku } = req.params;
    const { nombre_producto, costo_total, costo_no_iva, img, descripcion, puntos_producto, descuento } = req.body;

    // Validaciones básicas
    if (!nombre_producto || !costo_total || !costo_no_iva) {
        return res.status(400).json({ mensaje: 'Nombre, costo total y costo sin IVA son obligatorios.' });
    }

    if (costo_total <= 0 || costo_no_iva <= 0) {
        return res.status(400).json({ mensaje: 'El costo total y el costo sin IVA deben ser mayores a 0.' });
    }

    // Llamada al procedimiento almacenado
    const query = `CALL modificar_producto_datos(?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [sku, nombre_producto, costo_total, costo_no_iva, img, descripcion, puntos_producto, descuento], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Verificar si el producto fue modificado
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado.' });
        }

        res.status(200).json({ mensaje: 'Producto modificado correctamente.' });
    });
};

// Modificar el inventario de un producto
const modificarInventario = async (req, res) => {
    const { sku } = req.params;
    const { cantidad_inventario } = req.body;

    // Validar que la cantidad de inventario sea un número
    if (typeof cantidad_inventario !== 'number' || cantidad_inventario < 0) {
        return res.status(400).json({ mensaje: 'La cantidad no es válida.' });
    }

    const query = `CALL modificar_producto_inventario(?, ?)`;

    connection.query(query, [sku, cantidad_inventario], (err, results) => {
        if (err) {
            if (err.sqlState === '45000') {
                return res.status(400).json({ mensaje: err.sqlMessage });
            }
            return res.status(500).send(err);
        }

        // Verificar si se actualizó algún producto
        const affectedRows = results.affectedRows;
        if (affectedRows === 0) {
            return res.status(200).json({ mensaje: 'El inventario se ha actualizado correctamente.' });
        }

        res.status(200).json({ mensaje: 'Inventario modificado correctamente.' });
    });
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    const { sku } = req.params;

    const query = `CALL eliminar_producto(?)`;

    connection.query(query, [sku], (err, results) => {
        if (err) {
            if (err.sqlState === '45000') {
                return res.status(400).json({ mensaje: err.sqlMessage });
            }
            return res.status(500).send(err);
        }

        res.status(200).json({ mensaje: `Producto con SKU ${sku} eliminado correctamente.` });
    });
};




module.exports = {
    insertarProducto,
    obtenerProductosTodos,
    obtenerProductoPorSKU,
    modificarProducto,
    modificarInventario,
    eliminarProducto
};
