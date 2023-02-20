const { Empresa } = require('../models');
const Role = require('../models/role');
const usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Empleado = require('../models/empleado');


const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
};
const CorreoExiste =async(correo ='')=>{
const existeEmail = await usuario.findOne({correo});
if (existeEmail){
    throw new Error(`El correo ${correo} ya esta registrado en la base de datos`)
}
};
const IdExiste =async(id)=>{
    const existeId = await usuario.findById(id);
    if (!existeId){
        throw new Error(`El id ${id} no existe en la base de datos`) 
     }
};

const existeEmpresaPorId =async(id)=>{
    const existeEmpresa = await Empresa.findById(id);
    if (!existeEmpresa){
        throw new Error(`El id ${id} no existe en la base de datos`) 
     }
};

const existeCategoriaPorId =async(id)=>{
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria){
        throw new Error(`El id ${id} no existe en la base de datos`) 
     }
};

const existeProductoPorId =async(id)=>{
    const existeProducto = await Producto.findById(id);
    
    if (!existeProducto){
        throw new Error(`El id ${id} no existe en la base de datos`) 
     }
};
const existeEmpleadoPorId =async(id)=>{
    const existeEmpleado = await Empleado.findById(id);
    
    if (!existeEmpleado){
        throw new Error(`El id ${id} no existe en la base de datos`) 
     }
};

const existeUsuarioPorId =async(id)=>{
    const existeUsuario = await usuario.findById(id);
    
    if (!existeUsuario){
        throw new Error(`El id ${id} no existe en la base de datos`) 
     }
};

//validar colecciones permitidas

const coleccionesPermitidas = (coleccion='', colecciones=[])=>{

    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {esRoleValido, 
                  CorreoExiste, 
                  IdExiste, 
                  existeEmpresaPorId, 
                  existeProductoPorId, 
                  coleccionesPermitidas, 
                  existeCategoriaPorId,
                  existeEmpleadoPorId,
                  existeUsuarioPorId
                }