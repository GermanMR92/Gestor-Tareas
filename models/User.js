const moongoose = require('mongoose');

const UsersSchema = moongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true // Quita los espacios del por delante y detras del nombre al introducirlo en la base
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now()
    }
});

module.exports = moongoose.model('User', UsersSchema) // Exportamos el esquema para usarlo en el controller.