
const {Schema, model} = require('mongoose');

const usuario = require('./usuario');

const EmpleadoSchema = new Schema({
    nombre:{
        type: String,
        required:[true, 'El nombre es obligatorio'],
        unique: true
    },
    correo:{
        type:String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required: true
    },
    empresa:{
        type: Schema.Types.ObjectId,
        ref:'Empresa',
        required: true
    },
    descripcion:{ type: String },
    
    img:{ type: String },
});
EmpleadoSchema.methods.toJSON = function(){
    const {__v, estado,...data } = this.toObject();
   
    return data;
}
module.exports = model('Empleado', EmpleadoSchema);