// En este archivo Verifica que el usuario este iniciado para poder gestionar los proyectos

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' }); // *ancla

module.exports = function(req, res, next) {
    // Leemos el token del header, que lo hemos puesto a mano en postman
    const token = req.header('x-auth-token');

    // Revisar si no hay token
    if (!token) {
        return res.status(401).json({msg: 'No hay token, permiso no valido'});
    }

    // Validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA); // *ancla
        req.user = cifrado.user; // Guardamos en req.user el usuario el cual viene con el token
        next(); // Salta al siguiente middleware
        
    } catch (error) {
        res.status(401).json({msg: 'Token no valido'});
    }
}