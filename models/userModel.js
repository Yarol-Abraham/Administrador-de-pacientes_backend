const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({

    nombre: {
        type: String,
        trim: true,
        required: [true, 'Falta ingresar un nombre']
    },

    apellido: {
        type: String,
        trim: true,
        required: [true, 'Falta ingresar un apellido']
    },

    usuario: {
        type: String,
        trim: true,
        unique:true,
        required: [true, 'Falta ingresar un usuario']
    },

    password: {
        type: String,
        trim: true,
        required: [true, 'Falta ingresar una contraseña']
    },

    passwordConfirm: {
        type: String,
        trim: true,
        required: [true, 'Falta confirmar su contraseña'],
        validate: {
            validator: function(el){ return el === this.password; },
            message: "Las contraseñas no son iguales, intente de nuevo"
        }
    },

    passwordChangedAt: Date
});

userSchema.pre('save', async function(next) // antes de crear un nuevo usuario
{
    // solo se ejecuta si la contraseña ha cambiado
    if( !this.isModified('password') ) return next();
    // encriptar la contraseña del usuario
    this.password = await bcryptjs.hash(this.password, 12);
    this.passwordConfirm = "undefined";
});

userSchema.pre('save', async function(next) // cuando se modifica la contraseña expiramos el token
{
    if( !this.isModified('password') || this.isNew ) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// método para comparar las contraseñas
userSchema.methods.correctPassword = async function(candidatePassword, userPassword)
{
    return await bcryptjs.compare(candidatePassword, userPassword);
}

//método para verificar si la contraseña ha sido modificada
userSchema.methods.changedPasswordAtfer = function(jwtTimeStamp)
{
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return jwtTimeStamp < changedTimeStamp;
    }
    return false;
}

const user = mongoose.model('Usuarios', userSchema);
module.exports = user;