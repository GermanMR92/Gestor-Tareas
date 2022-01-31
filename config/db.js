// Requerimos moongoose 
const mongoose = require('mongoose');

// dotenv nos permite leer los archivos .env
// con esta linea estamos leyendo la string de conexion que se encuentra en variables.env
require('dotenv').config({ path: 'variables.env' });

//const conn = 'mongodb+srv://german:25111992german!@cluster0.j86t8.mongodb.net/merntasks';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        console.log('DB Connected');

    } catch (error) {
        console.log(error);
        process.exit(1); // Si hay un error detiene la app
    }
}

module.exports = connectDB;