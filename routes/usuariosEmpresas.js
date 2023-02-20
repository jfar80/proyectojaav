const {Router}=require('express');
const {check}=require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearUsuarioEmpresa, obtenerUsuariosEmpresas, obtenerUsuarioEmpresa, actualizarUsuarioEmpresa, borrarUsuarioEmpresa } = require('../controllers/usuariosEmpresas');
const { existeEmpresaPorId, existeUsuarioPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');



const router = Router();

//optener todos los empleados - publico
router.get('/', obtenerUsuariosEmpresas);

//optener un empleado por id - publico 

router.get('/:id',[
    check('id', 'No es un Id de Mongo valido').isMongoId(),
   
    check('id').custom(existeEmpresaPorId),
    validarCampos], obtenerUsuarioEmpresa);
   

//crear un empleado - privado - cualquier rol, cualquier persona con un token valido
router.post('/:id', [
    validarJWT,
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('id', 'No es un ID de mongo valido').isMongoId(), 
    check('id').custom(existeEmpresaPorId),
    validarCampos 
    ], crearUsuarioEmpresa); 


//actualizar un registro por este id
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID de mongo valido').isMongoId(), 
    check('id').custom(existeEmpresaPorId),
    validarCampos
    ], actualizarUsuarioEmpresa);


//Eliminar un registro por este id - cualquiera con token valido


//borrar un empleado - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeEmpresaPorId),
    validarCampos
    ], borrarUsuarioEmpresa);


module.exports = router;