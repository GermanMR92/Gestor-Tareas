const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth'); // Middleware personalizado que comprueba que el usuario este logeado para posteriormente realizar acciones sobre proyectos
const { check } = require('express-validator');

// RUTAS

// Crear proyectos
// api/projects
router.post('/', 
    auth, // Primero vemos que el usuario esta autenticado
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],  
    projectController.createProject
);

// obtener proyectos
router.get('/', 
    auth,
    projectController.getProjects
);

// Actualizar proyecto via ID
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ], 
    projectController.updateProject
);

// Eliminar un proyecto
router.delete('/:id', 
    auth,
    projectController.deleteProject
);

module.exports = router;