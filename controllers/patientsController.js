const Patient = require('../models/patientsModel');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./handleFactory');
const AppError = require('../utils/AppError');
const apiFectures = require('../utils/apiFectures');

// respuesta del servidor
const sendResponse = (doc, res, statusCode)=>{
    res.status(statusCode).json({
        status: 'success',
        data: doc
    });
}

// crear un paciente
exports.createPatient = Factory.create(Patient);

// obtener un paciente por id
exports.getPatient = Factory.getFindId(Patient, 'Patient'); 

// obtener todos los pacientes
exports.getPatients = catchAsync( async (req, res, next)=>{
    const { page, limit, sort, search } = req.query;

    let getPage = page ? page : 1;
    let getLimit = limit ? limit : 25;

    let queryObj = {};
    if(search){
        queryObj = {
            id_usuario: req.user._id, 
            $text:{ $search: search }
        }
    }else{
        queryObj = {
            id_usuario: req.user._id
        }
    }

    const doc = await Patient.find(queryObj)
    .sort( sort ? sort : '' )
    .skip( apiFectures.paginate(getPage, getLimit).skip )
    .limit( apiFectures.paginate(getPage, getLimit).limit )

    const results = await Patient.find({ 
        id_usuario: req.user._id 
    }).countDocuments() / getLimit;

    if(!doc) return next(new AppError(
        "No se encontro ningun registro",
        400
    ));

    res.status(200).json({
        status: 'success',
        results: Math.round(results),
        data: doc
    });
});

// actualizar un paciente
exports.updatePatient = Factory.updateFindId(Patient, 'Patient');

exports.deletePatient = catchAsync( async (req, res, next)=>{
    const doc = await Patient.findOneAndDelete({
        _id: req.params.id,
        id_usuario: req.user._id
    });
    if(!doc) return next(new AppError(
        "El registro que intentas eliminar no existe!",
        400
    ));
    sendResponse(doc, res, 200);
}); 