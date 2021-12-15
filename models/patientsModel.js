const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({

    nombres: {
        type: String,
        trim: true,
        required: [ true, 'Falta ingresar el nombre del paciente' ]
    },

    apellidos: {
        type: String,
        trim: true,
        required: [ true, 'Falta ingresar los apellidos del paciente' ]
    },

    telefono: {
        type: String,
        trim: true,
        required: [ true, 'Falta ingresar el telefono del paciente' ]
    },

    direccion: {
        type: String,
        trim: true,
        required: [ true, 'Falta ingresar una dirección del paciente' ]
    },

    ocupacion: {
        type: String,
        trim: true,
        required: [ true, 'Falta ingresar la ocupación del paciente' ]
    },

    sintomas: [String],

    descripcion: {
        type: String,
        trim: true,
        required: [ true, 'Agrega una descripcion de la situacion del paciente' ]
    },

    creacion: {
        type: Date,
        default: Date.now
    },
    
    fecha: {
        type:String,
        trim: true,
        required: [ true, 'Falta Agregar una fecha de registro para el paciente' ]
    },
    
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
    }

});

patientSchema.index({ 
    nombres: 'text',
    apellidos: 'text',
    descripcion: 'text',
    telefono: 'text',
    ocupacion: 'text',
    fecha: 'text'
})

const patient = mongoose.model('Pacientes', patientSchema);
module.exports = patient;