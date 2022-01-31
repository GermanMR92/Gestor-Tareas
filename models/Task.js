const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    nombre: {
        type: String, 
        required: true,
        trim: true // quita los espacios por delante y detras al entrar en la base
    },
    estado: {
        type: Boolean, 
        default: false
    },
    creado: {
        type: Date, 
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects'
    }
});

module.exports = mongoose.model('Task', TaskSchema);