const User = require('../models/User');
const bcryptjs = require('bcryptjs'); // Nos permite hashear las contraseñas. npm install bcryptjs
const { validationResult } = require('express-validator'); // se encarga de recoger los errores que vienen del check en routes/users.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' }); // *ancla

exports.createUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({email}); /* hay un usuario en la base con ese email? */

        if (user) {
            return res.status(400).json({msg: 'Ya existe el usuario'});
        }

        user = new User(req.body); // crear usuario

        const salt = await bcryptjs.genSalt(10); // el hash tomara 10 bit, se le puede pasar mas o menos
        user.password = await bcryptjs.hash(password, salt); // hasheamos la contraseña del usuario

        await user.save(); // guardar usuario en la base

        // LE ASIGNAMOS UN JsonWebToken AL USUARIO
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
        res.status(400).send('Hubo un error'); // Mensaje de error
    }
}