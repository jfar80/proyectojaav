
const{response} = require ('express');

const {EmpleadoEmpresa} =require('../models/index');



//obtenerEmpleados - paginado - total - populate es me mongoouse

const obtenerEmpleadosEmpresas = async(req = request, res=response)=> {
   
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
      
    const registrosConsultados = limite - desde;    

    const [empleadosEmpresasEnBD, empleadosEmpresas] = await Promise.all([
        EmpleadoEmpresa.countDocuments(query),
        EmpleadoEmpresa.find(query)
            .populate('usuario', 'nombre')
            .populate('empresa', 'nombre')
    
    ]);

    res.json({
        registrosConsultados,
        empleadosEmpresasEnBD,
        empleadosEmpresas
   });
}


//obtenerEmpleado - paginado - total - populate es me mongoouse {regresar el objeto de la empleado

const obtenerEmpleadoEmpresa = async(req, res = response)=> {

    
    const {id} =req.params;
    
    const empleadoEmpresa = await EmpleadoEmpresa.findById(id)
        .populate('usuario', 'nombre')
        .populate('empresa', 'nombre');
    
    res.json(empleadoEmpresa );
}

const crearEmpleadoEmpresa = async(req, res = response)=> {
   
    const {estado, usuario, ...body }= req.body;
    const empresa = req.params.id;
    
  

    const empleadoEmpresaDB = await EmpleadoEmpresa.findOne({id:body._id, id: empresa});

    if (empleadoEmpresaDB){
        return res.status(400).json({
            msg:`El Empleado ${empleadoEmpresaDB.id}, ya esta asociado a esa empresa`
        });
    }
        // Generar la data a guardar
        const data ={
            ...body,
            empresa: empresa,
            usuario: req.usuario._id
        }
        
        const empleadoEmpresa = new EmpleadoEmpresa(data);

        //guardar db
        await empleadoEmpresa.save();

        res.status(201).json(empleadoEmpresa);
    
}


// actualizar empleado recibe el nombre y cambiarlo si no existe

const actualizarEmpleadoEmpresa = async(req, res=response)=> {
    const {id} =req.params;
    const {estado, usuario, ...data} = req.body;
    
    if (data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }


    data.usuario =req.usuario._id;
    
    const empleadoEmpresa = await EmpleadoEmpresa.findByIdAndUpdate(id, data, {new:true});


    res.json({empleadoEmpresa});
}

// borrar empleado (desabilitar en la base de datos estado:false)
const borrarEmpleadoEmpresa = async(req, res=response) => {

    const {id} =req.params;
    const EmpleadoEmpresaBorrado = await EmpleadoEmpresa.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(EmpleadoEmpresaBorrado);

}



module.exports ={crearEmpleadoEmpresa, obtenerEmpleadosEmpresas, obtenerEmpleadoEmpresa, actualizarEmpleadoEmpresa, borrarEmpleadoEmpresa}