const User = require('../models/userModel');
const  AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

// credenciales del token
const signToken = function(_id){
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// enviamos la respuesta
const sendToken = (user, res, statusCode)=>{
    const token =  signToken(user._id);
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
};

// crear un nuevo usuario
exports.signup = catchAsync( async (req, res, next)=>{
   const newUser = await User.create(req.body);
   sendToken(newUser, res, 200);
}); 

// Iniciar sesión con un usuario existente
exports.login = catchAsync( async (req, res, next)=>{

    const { usuario, password } = req.body;

    // validar que los campos existan
    if(!usuario || !password ) return next(new AppError(
        "Por favor ingrese su usuario y contraseña para iniciar sesión",
        400
    ));

    // validar que el usuario exista en la base de datos
    const user = await User.findOne({ usuario }).select('+password');
    
    if(!user) return next(new AppError(
        "El usuario con el que intenta iniciar sesión no existe",
        401
    ));

    // validar que la contraseña ingresa sea la correcta
    const correctPassword = await user.correctPassword(password, user.password);

    if(!correctPassword) return next(new AppError(
        "El usuario o la contraseña son incorrectas",
        400
    ));

    sendToken(user, res, 200);
}); 

// proteger las rutas - solo para usuarios autenticados
exports.protect = catchAsync( async (req, res, next)=>{
    
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){ token = req.headers.authorization.split(' ')[1]; }
    
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded._id);
    
    // si el usuario ya no existe / o no existe
    if(!currentUser) return next(new AppError(
        "Lo sentimos el usuario actual no existe",
        401
    ));

    // verificamos si el usuario a cambiado su contraseña recientemente
    const verifyChangedPassword = await currentUser.changedPasswordAtfer(decoded.iat);
    
    if(verifyChangedPassword) return next(new AppError(
        "El usuario ha cambiado su contraseña recientemente, vuelve a iniciar sesión",
        401
    ));

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

// actualizar la contraseña del usuario autenticado
exports.updatePassword = catchAsync( async (req, res, next)=>{
    
    const { password, newPassword, passwordConfirm } = req.body;

    if(!password || !newPassword || !passwordConfirm ) return next(new AppError(
        "Debes de llenar todos los campos requeridos para continuar",
        400
    ));
    
    const user = await User.findById(req.user._id).select('+password');
    const correctPassword = await user.correctPassword(password, user.password);

    if(!correctPassword) return next(new AppError(
        "La contraseña actual es incorrecta, por favor vuelve intentar!",
        400
    ));

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    await user.save();
    
    sendToken(user, res, 200);
});