const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth'); // Middleware personalizado que comprueba que el usuario este logeado para posteriormente realizar acciones sobre las tareas
const { check } = require('express-validator');

// api/task

// crear tarea
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    taskController.createTask
    );
    
//Obtener tareas por proyectos // No filtramos por ID porque ya lo obtenemos por el body
router.get('/',
    auth,
    taskController.getTasks
);

//actualizar tarea
router.put('/:id',
    auth,
    taskController.udateTasks
);

//Eliminar tarea
router.delete('/:id',
    auth,
    taskController.deleteTasks
);

module.exports = router;