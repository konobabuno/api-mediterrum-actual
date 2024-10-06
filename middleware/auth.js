require('dotenv').config();
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraer el token después de 'Bearer '

    if (!token) {
        return res.status(400).json({ mensaje: 'Token requerido' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(400).json({ mensaje: 'Token inválido o expirado' });
        }

        req.usuario = decoded; // Agregar información del usuario a la solicitud
        next();
    });
};

module.exports = verificarToken;

