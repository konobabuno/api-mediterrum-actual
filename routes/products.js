const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.js');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../../frontend/crud_frontend/assets'); // Adjust as needed
        cb(null, uploadPath);
        // cb(null, './assets');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
    }
});

// Initialize multer
const upload = multer({ storage });

// Ruta para obtener todos los productos
router.get('/', productsController.obtenerProductosTodos);

// Ruta para obtener un producto por SKU
router.get('/:sku', productsController.obtenerProductoPorSKU);

// Ruta para insertar un producto
router.post('/', upload.single('image'), productsController.insertarProducto);

// Ruta para modificar los datos de un producto
router.put('/:sku', productsController.modificarProducto);

// Ruta para modificar el inventario de un producto
router.put('/:sku/inventario', productsController.modificarInventario);

// Ruta para eliminar un producto
router.delete('/:sku', productsController.eliminarProducto);

module.exports = router;