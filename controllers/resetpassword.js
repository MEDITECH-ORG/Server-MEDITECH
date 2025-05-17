const sql = require('mssql');
const dbConfig = require('../db/db.js'); 

const emailvalidation = async (req,res) => {
    try {
        const {CorreoUsuario} = req.body;

        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('CorreoUsuario', sql.VarChar(100), CorreoUsuario)
        request.output('Nombre', sql.VarChar(100));
        request.output('ExisteCorreo', sql.Bit);
        
        let result = await request.execute('spComprobarCorreo');

        res.json({
            Nombre: result.output.Nombre,
            ExisteCorreo: result.output.ExisteCorreo
        })
    } catch (error) {
        console.error('El usuario no existe', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const resetpassword = async (req, res) => {
    try {
        const { CorreoUsuario, NuevaContrasena } = req.body;

        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('CorreoUsuario', sql.VarChar(100), CorreoUsuario);
        request.input('NuevaContrasena', sql.VarChar(100), NuevaContrasena);

        let result = await request.execute('spCambiarContrasena');

        const Success = result.rowsAffected[0] > 0;

        res.json({Success});

    } catch (error) {
        console.error('Error en resetpassword:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};


module.exports = 
{
    emailvalidation,
    resetpassword
};