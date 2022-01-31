// Configuracion del servidor express
const express = require('express'); //Importamos express
const connectDB = require('./config/db');
const cors = require('cors'); // se instala con npm i cors
require('dotenv').config({ path: 'variables.env' });

// CREAR SERVIDOR
const app = express(); 

// CONECTAR A LA BD
connectDB();

// HABILITAR CORS
app.use(cors()); // por seguridad cuando hay conexion de una URL a otra salta una advertencia, con cors podemos conectar back y front

// HABILITAR EXPRESS.JSON para leer datos que el usuario ponga
app.use(express.json({ extended: true }));

// PUERTO DEL SERVER
const PORT = process.env.PORT || 4000; // si existe el puerto en process del arch variables.env se asigna si no el 4000 (el cliente en el 3000)

// prueba de que el servidor esta corriendo, tan solo entramos a localhost:4000
app.get('/', (req, res) => {
    res.send('Hola Mundo');
})

// RUTAS
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// ARRANCAR SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ON en el puerto ${port}`);
})