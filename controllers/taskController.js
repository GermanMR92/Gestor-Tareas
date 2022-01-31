const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Crear una tarea
exports.createTask = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    try {

        // extraemos el proyecto 
        const { proyecto } = req.body;

        //comprobar que existe al cual va a pertenecer la tarea
        const projectExist = await Project.findById(proyecto);
        if (!projectExist) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisamos que sea el creador del proyecto
        if (projectExist.creador.toString() !== req.user.id) { // el id del user viene en el token via header
            return res.status(401).json({msg: 'No autorizado'}); 
        }

        // creamos la tarea
        const task = new Task(req.body); 
        await task.save();
        res.json({task}); //Imprimimos la tarea para verificar

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }

}

// Obtener tareas pro proyectos
exports.getTasks = async (req, res) => {

    try {
        // extraemos el proyecto 
        const { proyecto } = req.query; // Recogemos la id del proyecto cuando hacemos la consulta en el cliente

        //comprobar que existe al cual va a pertenecer la tarea
        const projectExist = await Project.findById(proyecto);
        if (!projectExist) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Revisamos que sea el creador del proyecto
        if (projectExist.creador.toString() !== req.user.id) { // el id del user viene en el token via header
            return res.status(401).json({msg: 'No autorizado'}); 
        }

        // obtener tareas por proyectos
        const tasks = await Task.find({ proyecto }); // esta sentencia es como un Where de MySQL y le estamos diciendo que nos de las tareas del proyecto pasado
        res.json({ tasks });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// actualizar tareas
exports.udateTasks = async (req, res) => {

    try {
        // extraemos el proyecto 
        const { proyecto, nombre, estado } = req.body;

        //comprobar que existe la tarea
        let task = await Task.findById(req.params.id);
 
        if (!task) {
            return res.status(404).json({msg: 'No existe la tarea'}); 
        }
        
        // extraemos el proyecto
        const projectExist = await Project.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (projectExist.creador.toString() !== req.user.id) { // el id del user viene en el token via header
            return res.status(401).json({msg: 'No autorizado'}); 
        }

        // creamos la nueva tarea actualizada
        const newTask = {};

        newTask.nombre = nombre;
        newTask.estado = estado;

        // Guardamos la tarea
        task = await Task.findByIdAndUpdate({_id: req.params.id}, newTask, { new: true} ); // new true hace que se cree una instancia del objeto para acceder a las propiedades

        res.json({ task });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Eliminar tarea por ID
exports.deleteTasks = async (req, res) => {

    try {
        // extraemos el proyecto 
        const { proyecto } = req.query;

        //comprobar que existe la tarea
        let task = await Task.findById(req.params.id);
 
        if (!task) {
            return res.status(404).json({msg: 'No existe la tarea'}); 
        }
        
        // extraemos el proyecto
        const projectExist = await Project.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (projectExist.creador.toString() !== req.user.id) { // el id del user viene en el token via header
            return res.status(401).json({msg: 'No autorizado'}); 
        }

        // eliminamos la tare
        await Task.findByIdAndRemove({ _id: req.params.id });
        return res.json({msg: 'Tarea eliminada'}); 
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}