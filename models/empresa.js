
const {Schema, model} = require('mongoose');


const EmpresaSchema = Schema({
    nit:{
        type:String,
        required:[true, 'El nit es obligatorio'],
    },
    nombre:{
        type: String,
        required:[true, 'El nombre es obligatorio'],
        unique: true
    },
    direccion:{
        type:String,
        required:[true, 'La direccion es obligatorio'],
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
    }
});
// se utiliza para quitar campos que no me interesa enviar en la respuesta
EmpresaSchema.methods.toJSON = function(){
    const {__v, estado,...data } = this.toObject();
   
    return data;
}
module.exports = model('Empresa', EmpresaSchema);