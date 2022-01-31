const Project = require('../models/Project');
const Task = require('../models/Task')
const { validationResult } = require('express-validator');


exports.createProject = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    try {
        //Crear nuevo proyecto
        const project = new Project(req.body);

        //Obtenemos el creador del proyecto via JWT, que viene por el header desde el archivo middleware/auth.js
        project.creador = req.user.id;

        // guardamos el proyecto
        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtener proyectos del usuarios actual
exports.getProjects = async (req, res) => {

    try {
        const projects = await Project.find({ creador: req.user.id }); // El id viene con el req desde middleware/auth.js a traves del token 
        res.json({ projects });
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

// Actualizar un proyecto
exports.updateProject = async (req, res) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    //Extraemos la info del proyecto
    const { nombre } = req.body;
    const newProject = {};

    if (nombre) {
        newProject.nombre = nombre;
    }

    try {
        
        //Revisamos que existe el proyecto // si pasamos la id del proyecto por URL la recogemos con req.params.id
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({msg: 'Proyecto no encontrado'}); 
        }

        //Revisamos que sea el creador del proyecto
        if (project.creador.toString() !== req.user.id) { // el id del user viene en el token via header
            return res.status(401).json({msg: 'No autorizado'}); 
        }

        //Actualizamos el proyecto
        project = await Project.findByIdAndUpdate({ _id: req.params.id}, {$set: newProject}, {new: true});
        res.json({project});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

//Eliminar proyecto por su ID
exports.deleteProject = async (req, res) => {
        
    try {
        //Revisamos que existe el proyecto // si pasamos la id del proyecto por URL la recogemos con req.params.id
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({msg: 'Proyecto no encontrado'}); 
        }

        //Revisamos que sea el creador del proyecto
        if (project.creador.toString() !== req.user.id) { // el id del user viene en el token via header
            return res.status(401).json({msg: 'No autorizado'}); 
        }

        // Eliminar tareas antes de eliminar proyecto
        await Task.deleteMany({ proyecto: req.params.id });

        // Eliminar proyecto
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'Proyecto eliminado'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}