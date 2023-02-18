
const{response} = require ('express');

const {Empresa} =require('../models/index');



//obtenerEmpresas - paginado - total - populate es me mongoouse

const obtenerEmpresas = async(req = request, res=response)=> {
   
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
      
    const registrosConsultados = limite - desde;    

    const [EmpresasEnBd, empresas] = await Promise.all([
        Empresa.countDocuments(query),
        Empresa.find(query)
            .populate('usuario', 'nombre')
    
    ]);

    res.json({
        registrosConsultados,
        EmpresasEnBd,
        empresas
   });
}


//obtenerCategoria - paginado - total - populate es me mongoouse {regresar el objeto de la categoria

const obtenerEmpresa = async(req, res = response)=> {

    
    const {id} =req.params;
    
    const empresa = await Empresa.findById(id).populate('usuario', 'nombre');
    
    res.json(empresa );
}

const crearEmpresa = async(req, res = response)=> {
   
    const nombre = req.body.nombre.toUpperCase();
    const nit = req.body.nit;
    const direccion = req.body.direccion;


    const empresaDB = await Empresa.findOne({nombre});

    if (empresaDB){
        return res.status(400).json({
            msg:`La Empresa ${empresaDB.nombre}, ya existe`
        });
    }
        // Generar la data a guardar
        const data ={
            nit,
            nombre,
            direccion, 
            usuario: req.usuario._id
        };
        
        const empresa = new Empresa(data);

        //guardar db
        await empresa.save();

        res.status(201).json(empresa);
    
}


// actualizar categoria recibe el nombre y cambiarlo si no existe

const actualizarEmpresa = async(req, res=response)=> {
    const {id} =req.params;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario =req.usuario._id;
    
    const empresa=await Empresa.findByIdAndUpdate(id, data, {new:true});


    res.json({empresa});
}

// borrar categoria (desabilitar en la base de datos estado:false)
const borrarEmpresa = async(req, res=response) => {

    const {id} =req.params;
    const empresaBorrada = await Empresa.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(empresaBorrada);

}



module.exports ={crearEmpresa, obtenerEmpresas, obtenerEmpresa, actualizarEmpresa, borrarEmpresa}