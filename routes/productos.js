const {Router}=require('express');
const {check}=require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');



const router = Router();

//optener todas las empresas - publico
router.get('/', obtenerProductos);

//optener una empresa por id - publico 

router.get('/:id',[
    check('id', 'No es un Id de Mongo valido').isMongoId(),
   
    check('id').custom(existeProductoPorId),
    validarCampos], obtenerProducto);
   

//crear una empresa - privado - cualquier rol, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('categoria', 'No es un ID de mongo valido').isMongoId(), 
    check('categoria').custom(existeCategoriaPorId),
    validarCampos 
    ], crearProducto); 


//actualizar un registro por este id
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID de mongo valido').isMongoId(), 
    check('id').custom(existeProductoPorId),
    validarCampos
    ], actualizarProducto);


//Eliminar un registro por este id - cualquiera con token valido


//borrar una empresa - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
    ], borrarProducto);


module.exports = router;