// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

// CREAR UN USUARIO - api/usuarios
router.post('/', 

    // Usamos el express-validator para validar los datos
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Introduce un email válido').isEmail(),
        check('password', 'Debe ser mínimo de 4 caracteres').isLength({min: 4})
    ],

    userController.createUser
);

module.exports = router;