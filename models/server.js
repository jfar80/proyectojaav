const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');



class Server{
    
    constructor(){
    
     this.app = express();
     this.port= process.env.PORT;

     this.paths = {
        auth: '/api/auth',
        buscar:'/api/buscar',
        usuarios: '/api/usuarios',
        empresas:'/api/empresas',
        productos:'/api/productos',
        categorias:'/api/categorias',
        uploads:'/api/uploads',   
        empleados:'/api/empleados',   
        empleadosEmpresas:'/api/empleadosempresas',   
     }
     

     //Coectar a base de datos
     this.conectarDB();

     //Middlewares
        this.middlewares();
     //Rutas de mi aplicacion
   
     this.routes();
    }   

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.usuarios,require('../routes/usuarios'));
        this.app.use(this.paths.empresas,require('../routes/empresas'));
        this.app.use(this.paths.productos,require('../routes/productos'));
        this.app.use(this.paths.uploads,require('../routes/uploads'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.empleados,require('../routes/empleados'));
        this.app.use(this.paths.empleadosEmpresas,require('../routes/empleadosEmpresas'));
       
        
}
    listen(){
         this.app.listen(this.port,() =>{
         console.log('servidor corriendo en puerto', this.port);
        });
    }
}
module.exports = Server;