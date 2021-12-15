const mongoose = require('mongoose');
const app = require('./app');

// variables de entorno
const dotenv = require('dotenv');
dotenv.config({ path: "config.env" });

// capturar errores - excepciones no capturadas
process.on('uncaughtException', (err)=>{
    console.log(err.name ,err.message);
    console.log("ERROR DE TIPO: UNCAUGHTEXCEPTION... 😥😥");
    console.log(err.name ,err.message);
});

const DB = process.env.DATABASE
.replace(
    '<password>', process.env.DATABASE_PASSWORD 
);

// conectar a la base de datos
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("BASE DE DATOS CONECTADA") );

// Puerto
const PORT = process.env.PORT || '5000';

// Conectar al servidor
const server = app.listen(PORT, ()=>{
    console.log(`servidor conectado en el puerto: ${PORT}`);
    console.log(`DEV: ${process.env.NODE_ENV}`);
});

// capturar errores - excepciones no controladas
process.on('unhandledRejection', (err)=>{
    console.log("ERROR DE TIPO: UNHANDLEDREJECTION... 😥😥");
    console.log(err.name, err.message);
    server.close(()=> process.exit(1) );
});