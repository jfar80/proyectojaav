
const {Schema, model} = require('mongoose');

const usuario = require('./usuario');

const UsuarioEmpresaSchema = new Schema({
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
    
});
UsuarioEmpresaSchema.methods.toJSON = function(){
    const {__v, estado,...data } = this.toObject();
   
    return data;
}
module.exports = model('UsuarioEmpresa', UsuarioEmpresaSchema);