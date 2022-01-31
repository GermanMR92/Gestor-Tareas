const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    nombre: {
        type: String, 
        required: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, // Le pasamos el ID del usuario  
        ref: 'User' // aqui referenciamos al ObjectId pasandole el nombre del Schema de users.
    },
    creado: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Projects', ProjectSchema);