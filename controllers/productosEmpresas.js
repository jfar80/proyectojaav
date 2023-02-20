
const{response} = require ('express');

const {ProductoEmpresa} =require('../models/index');



//obtenerEmpleados - paginado - total - populate es me mongoouse

const obtenerProductosEmpresas = async(req = request, res=response)=> {
   
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
      
    const registrosConsultados = limite - desde;    

    const [productosEmpresasEnBD, productosEmpresas] = await Promise.all([
        ProductoEmpresa.countDocuments(query),
        ProductoEmpresa.find(query)
            .populate('usuario', 'nombre')
            .populate('empresa', 'nombre')
    
    ]);

    res.json({
        registrosConsultados,
        productosEmpresasEnBD,
        productosEmpresas
   });
}


//obtenerEmpleado - paginado - total - populate es me mongoouse {regresar el objeto de la empleado

const obtenerProductoEmpresa = async(req, res = response)=> {

    
    const {id} =req.params;
    
    const productoEmpresa = await ProductoEmpresa.findById(id)
        .populate('usuario', 'nombre')
        .populate('empresa', 'nombre');
    
    res.json(productoEmpresa );
}

const crearProductoEmpresa = async(req, res = response)=> {
   
    const {estado, usuario, ...body }= req.body;
    const empresa = req.params.id;
    
  

    const productoEmpresaDB = await ProductoEmpresa.findOne({id:body._id, id: empresa});

    if (productoEmpresaDB){
        return res.status(400).json({
            msg:`El Empleado ${productoEmpresaDB.id}, ya esta asociado a esa empresa`
        });
    }
        // Generar la data a guardar
        const data ={
            ...body,
            empresa: empresa,
            usuario: req.usuario._id
        }
        
        const productoEmpresa = new ProductoEmpresa(data);

        //guardar db
        await productoEmpresa.save();

        res.status(201).json(productoEmpresa);
    
}


// actualizar empleado recibe el nombre y cambiarlo si no existe

const actualizarProductoEmpresa = async(req, res=response)=> {
    const {id} =req.params;
    const {estado, usuario, ...data} = req.body;
    
    if (data.nombre){

        data.nombre = data.nombre.toUpperCase();
    }


    data.usuario =req.usuario._id;
    
    const productoEmpresa = await ProductoEmpresa.findByIdAndUpdate(id, data, {new:true});


    res.json({productoEmpresa});
}

// borrar empleado (desabilitar en la base de datos estado:false)
const borrarProductoEmpresa = async(req, res=response) => {

    const {id} =req.params;
    const productoEmpresaBorrado = await ProductoEmpresa.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json(productoEmpresaBorrado);

}



module.exports ={crearProductoEmpresa, obtenerProductosEmpresas, obtenerProductoEmpresa, actualizarProductoEmpresa, borrarProductoEmpresa}