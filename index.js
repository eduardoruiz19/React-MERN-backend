//console.log("hola mundo!!");
//! npm install bcryptjs
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config')
//console.log(process.env);
//Crear el servidor de Express
const app = express();

//Base de datos
dbConnection();

// CORS
app.use(cors());

app.use(express.static('public'));
//* Lectura  y parseo del Body
app.use(express.json());


//Rutas
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));
// TODO auth // crear , login,



//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

