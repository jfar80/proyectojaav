const {Router}=require('express');
const {check}=require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearEmpleado, obtenerEmpleados, obtenerEmpleado, actualizarEmpleado, borrarEmpleado } = require('../controllers/empleados');
const { existeEmpresaPorId, existeEmpleadoPorId } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares/validar-roles');



const router = Router();

//optener todos los empleados - publico
router.get('/', obtenerEmpleados);

//optener un empleado por id - publico 

router.get('/:id',[
    check('id', 'No es un Id de Mongo valido').isMongoId(),
   
    check('id').custom(existeEmpleadoPorId),
    validarCampos], obtenerEmpleado);
   

//crear un empleado - privado - cualquier rol, cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('empresa', 'No es un ID de mongo valido').isMongoId(), 
    check('empresa').custom(existeEmpresaPorId),
    validarCampos 
    ], crearEmpleado); 


//actualizar un registro por este id
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID de mongo valido').isMongoId(), 
    check('id').custom(existeEmpleadoPorId),
    validarCampos
    ], actualizarEmpleado);


//Eliminar un registro por este id - cualquiera con token valido


//borrar un empleado - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id de Mongo valido').isMongoId(),
    check('id').custom(existeEmpleadoPorId),
    validarCampos
    ], borrarEmpleado);


module.exports = router;