const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const sendResponse = (doc, res, statusCode)=>{
    res.status(statusCode).json({
        status: 'success',
        data: doc
    });
}

// crear un registro
exports.create = Model => catchAsync(async (req, res, next)=>{
    req.body.id_usuario = req.user._id.toString(); 
    const doc = await Model.create(req.body);
    sendResponse(doc, res, 200);
});

// obtener un registro por su id
exports.getFindId = (Model, name) => catchAsync( async (req, res, next)=>{
    let _id = name === 'User' ? req.user._id : req.params.id;
    const doc = await Model.findById(_id);
    if(!doc) return next(new AppError(
        "No se encontro ningun registro",
        400
    ));
    sendResponse(doc, res, 200);
});

// actualizar un registro por su id
exports.updateFindId = (Model, name) => catchAsync( async (req, res, next)=>{
    let _id = name === 'User' ? req.user._id : req.params.id;
    const doc = await Model.findByIdAndUpdate(_id, req.body, {
        new: true,
        runValidators: true
    });
    sendResponse(doc, res, 200);
});