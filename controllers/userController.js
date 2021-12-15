const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./handleFactory');

exports.notAcceptPassword = (req, res, next)=>{
    const { password, passwordConfirm } = req.body;
    
    if(
        password || passwordConfirm ||
        password === "" || passwordConfirm === ""
    ) return next(new AppError(
        "No se puede actualizar la contraseña en este formulario",
        405
    ));

    next();
}

exports.getMe = Factory.getFindId(User, "User");
exports.updateMe = Factory.updateFindId(User, 'User');