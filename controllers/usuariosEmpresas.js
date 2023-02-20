
const{response} = require ('express');

const {UsuarioEmpresa} =require('../models/index');



//obtenerEmpleados - paginado - total - populate es me mongoouse

const obtenerUsuariosEmpresas = async(req = request, res=response)=> {
   
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
      
    const registrosConsultados = limite - desde;    

    const [usuariosEmpresasEnBD, usuariosEmpresas] = await Promise.all([
        UsuarioEmpresa.countDocuments(query),
        UsuarioEmpresa.find(query)
            .populate('usuario', 'nombre')
            .populate('empresa', 'nombre')
    
    ]);

    res.json({
        registrosConsultados,
        usuariosEmpresasEnBD,
        usuariosEmpresas
   });
}


//obtenerEmpleado - paginado - total - populate es me mongoouse {regresar el objeto de la empleado

const obtenerUsuarioEmpresa = async(req, res = response)=> {

    
    const {id} =req.params;
    
    const usuarioEmpresa = await UsuarioEmpresa.findById(id)
        .populate('usuario', 'nombre')
        .populate('empresa', 'nombre');
    
    res.json(usuarioEmpresa );
}

const crearUsuarioEmpresa = async(req, res = response)=> {
   
    const {estado, usuario, ...body }= req.body;
    const empresa = req.params.id;
    
  

    const usuarioEmpresaDB = await UsuarioEmpresa.findOne({id:body._id, id: empresa});

    if (usuarioEmpresaDB){
        return res.status(400).json({
            msg:`El Usuario ${usuarioEmpresaDB.id}, ya esta asociado a esa empresa`
        });
    }
        // Generar la data a guardar
        const data ={
            ...body,
            empresa: empresa,
            usuario: req.usuario._id
        }
        
        const usuarioEmpresa = new UsuarioEmpresa(data);

        //guardar db
        await usuarioEmpresa.save();

        res.status(201).json(usuarioEmpresa);
    
}


// actualizar empleado recibe el nombre y cambiarlo si no existe

const actualizarUsuarioEmpresa = async(req, res=response)=> {
    const {id} =req.params;
    const {estado, usuario, ...data} = req.body;
    
    if (data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }


    data.usuario =req.usuario._id;
    
    const usuarioEmpresa = await UsuarioEmpresa.findByIdAndUpdate(id, data, {new:true});


    res.json({usuarioEmpresa});
}

// borrar empleado (desabilitar en la base de datos estado:false)
const borrarUsuarioEmpresa = async(req, res=response) => {

    const {id} =req.params;
    const usuarioEmpresaBorrado = await UsuarioEmpresa.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(usuarioEmpresaBorrado);

}



module.exports ={crearUsuarioEmpresa, obtenerUsuariosEmpresas, obtenerUsuarioEmpresa, actualizarUsuarioEmpresa, borrarUsuarioEmpresa}