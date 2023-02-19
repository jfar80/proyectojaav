
const{response} = require ('express');

const {Empleado} =require('../models/index');



//obtenerEmpleados - paginado - total - populate es me mongoouse

const obtenerEmpleados = async(req = request, res=response)=> {
   
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
      
    const registrosConsultados = limite - desde;    

    const [empleadosEnBD, empleados] = await Promise.all([
        Empleado.countDocuments(query),
        Empleado.find(query)
            .populate('usuario', 'nombre')
            .populate('empresa', 'nombre')
    
    ]);

    res.json({
        registrosConsultados,
        empleadosEnBD,
        empleados
   });
}


//obtenerEmpleado - paginado - total - populate es me mongoouse {regresar el objeto de la empleado

const obtenerEmpleado = async(req, res = response)=> {

    
    const {id} =req.params;
    
    const empleado = await Empleado.findById(id)
        .populate('usuario', 'nombre')
        .populate('empresa', 'nombre');
    
    res.json(empleado );
}

const crearEmpleado = async(req, res = response)=> {
   
    const {estado, usuario, ...body }= req.body;

    const empleadoDB = await Empleado.findOne({nombre:body.nombre});

    if (empleadoDB){
        return res.status(400).json({
            msg:`El Empleado ${empleadoDB.nombre}, ya existe`
        });
    }
        // Generar la data a guardar
        const data ={
            ...body,
            nombre: body.nombre.toUpperCase(), 
            usuario: req.usuario._id
        }
        
        const empleado = new Empleado(data);

        //guardar db
        await empleado.save();

        res.status(201).json(empleado);
    
}


// actualizar empleado recibe el nombre y cambiarlo si no existe

const actualizarEmpleado = async(req, res=response)=> {
    const {id} =req.params;
    const {estado, usuario, ...data} = req.body;
    
    if (data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }


    data.usuario =req.usuario._id;
    
    const empleado = await Empleado.findByIdAndUpdate(id, data, {new:true});


    res.json({empleado});
}

// borrar empleado (desabilitar en la base de datos estado:false)
const borrarEmpleado = async(req, res=response) => {

    const {id} =req.params;
    const EmpleadoBorrado = await Empleado.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(EmpleadoBorrado);

}



module.exports ={crearEmpleado, obtenerEmpleados, obtenerEmpleado, actualizarEmpleado, borrarEmpleado}