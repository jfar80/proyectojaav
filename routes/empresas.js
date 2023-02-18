const {Router}=require('express');
const {check}=require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearEmpresa, obtenerEmpresas, obtenerEmpresa, actualizarEmpresa, borrarEmpresa } = require('../controllers/empresas');
const { existeEmpresaPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');



const router = Router();

//optener todas las empresas - publico
router.get('/', obtenerEmpresas);

//optener una empresa por id - publico 

router.get('/:id',[
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeEmpresaPorId),
    validarCampos], obtenerEmpresa);
   

//crear una empresa - privado - cualquier rol, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    validarCampos 
    ], crearEmpresa); 


//actualizar un registro por este id
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('id').custom(existeEmpresaPorId),
    validarCampos
    ], actualizarEmpresa);


//Eliminar un registro por este id - cualquiera con token valido


//borrar una empresa - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeEmpresaPorId),
    validarCampos
    ], borrarEmpresa);


module.exports = router;