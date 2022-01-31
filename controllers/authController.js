const User = require('../models/User');
const bcryptjs = require('bcryptjs'); // Nos permite hashear las contraseñas. npm install bcryptjs
const { validationResult } = require('express-validator'); // se encarga de recoger los errores que vienen del check en routes/users.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });  // *ancla

exports.autenticarUsuario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    const { email, password } = req.body;

    try {
        // El usuario no existe?
        let user = await User.findOne({email}); 
        if(!user) {
            return res.status(400).json({msg: 'El usuario no existe'});
        };

        // si el usuario existe comparamos el password que introduce con el hasheado de la Base
        const passCorrecto = await bcryptjs.compare(password[0], user.password);
        if (!passCorrecto) {
            return res.status(400).json({msg: 'Password incorrecto'});
        };

        // si todo es correcto creamos el JWT para el user
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, { // *ancla
            expiresIn: 3600 // 1 hora de permiso en la app
        }, (error, token) => {
            if(error) throw error;
            res.json({ token : token }); // mensaje de confirmacion
        });
        
    } catch (error) {
        console.log(error);
    }
};

// Obtenemos que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
        res.json({user}); // devolvemos al usuario como respuesta cuando se autentica 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}