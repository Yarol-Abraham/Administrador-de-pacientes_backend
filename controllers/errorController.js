const AppError = require('../utils/AppError');

// captura errores de campos vacios en formularios
const ValidatorError = function(errors){
    let message = [];
    Object.values(errors).forEach(err =>{
        const msg = {
            name: err.properties.path,
            message: err.properties.message
        }
        message.push(msg);
    });
    return new AppError(JSON.stringify(message), 400);
}

// captura el error si hay campos duplicados (solo si se ha especificado en el modelo)
const DuplicateKey = function(error){
    
    const { usuario } = error.keyValue;

    let message = `Lo sentimos el usuario con el nombre: ${usuario} ya existe 😥`;
    return new AppError(message, 400);
} 

// dev:development - mostrar errores en desarrollo
const sendDev = function(err, res){
    res.status(err.statusCode).send({
        status: res.status,
        message: err.message,
        err: err,
        stack: err.stack
    })
}

// dev:production - mostrar errores en producción
const sendProd = function(err, res){
  if(err.isOperational){
      return res.status(err.statusCode).send({
        status: err.status,
        message: err.message
      });
  }

  res.status(500).send({
      status: "error",
      message: "Ha ocurrido un error inesperado en el servidor! vuelve a intentarlo 😣"
  });
}

module.exports = function(err, req, res, next){
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendDev(err, res);
    }
    else if(process.env.NODE_ENV === 'production'){
        let error = { ...err };
        error.message = err.message;
       
        if(error.errors) error = ValidatorError(error.errors);
        if(error.code === 11000) error = DuplicateKey(error);
        
        sendProd(error, res);
    }
}