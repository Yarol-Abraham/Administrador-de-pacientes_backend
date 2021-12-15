const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const expressMongoSanitize = require('express-mongo-sanitize');
const expressRateLimit = require('express-rate-limit');
const xss = require('xss-clean');

// controlar los errores
const errorController = require('./controllers/errorController');
const AppError = require('./utils/AppError');

// enrutador
const userRouter = require('./routes/userRouter');
const patientsRouter = require('./routes/patientsRouter');

// variables de entorno
const dotenv = require('dotenv');
dotenv.config({ path: "config.env" });

const app = express();

//cors
 const opCors = { origin: process.env.API_FRONTD } 
 app.use(cors(opCors) );

//Security Headers
app.use( helmet() );

// limite de solicitudes
const limiter = expressRateLimit({
    max: 1000, 
    windowMs: 60 * 60 * 1000, // tiempo por hora
    message: "Lo sentimos has llegado al limite de solicitudes 😥, intenta en una 1 hora nuevamente"
});
app.use('/api', limiter );

// json
app.use( express.json({ limit: '10kb' }) );
app.use( express.urlencoded({ extended: true }) );

// sanitizar - mongo
app.use( expressMongoSanitize() );

// xss
app.use( xss() );

// rutas - api
app.use('/api/v1/user', userRouter);
app.use('/api/v1/patients', patientsRouter);

// capturar errores en la url
app.use('*', (req, res, next)=>{
    next(new AppError(`No se encontro la ${req.originalUrl} en este servidor`, 404));
});

// controlar los errores
app.use(errorController);

module.exports = app;