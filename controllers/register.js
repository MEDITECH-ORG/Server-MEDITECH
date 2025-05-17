const sql = require('mssql');
const dbConfig = require('../db/db.js');

const verifyemail = async (req, res) => {
    try {
        const {CorreoUsuario} = req.body;
        
        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('CorreoUsuario', sql.VarChar(100), CorreoUsuario);
        request.output('Nombre', sql.VarChar(100));
        request.output('ExisteCorreo', sql.Bit);

        let result = await request.execute('spComprobarCorreo');

        res.json({
            ExisteCorreo: result.output.ExisteCorreo
        })
    } catch (error) {
        console.error('El usuario no existe', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const registeruserP = async (req, res) => 
{
    try 
    {
        const {Nombre, ApellidoPaterno, ApellidoMaterno, Telefono, Direccion, 
        FechaNacimiento, CorreoUsuario, ContraUsuario, TipoU} = req.body;

        if (!Nombre || !ApellidoPaterno || !ApellidoMaterno || !Telefono || !Direccion
            || !FechaNacimiento || !CorreoUsuario || !ContraUsuario || !TipoU) 
        {
            return res.status(400).json({ error: 'Datos son requeridos' });
        }

        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('Nombre', sql.VarChar(100), Nombre);
        request.input('ApellidoPaterno', sql.VarChar(100), ApellidoPaterno);
        request.input('ApellidoMaterno', sql.VarChar(100), ApellidoMaterno);
        request.input('Telefono', sql.VarChar(15), Telefono);
        request.input('Direccion', sql.VarChar(255), Direccion);
        request.input('FechaNacimiento', sql.Date, FechaNacimiento);
        request.input('CorreoUsuario', sql.VarChar(100), CorreoUsuario);
        request.input('ContraUsuario', sql.VarChar(100), ContraUsuario);
        request.input('TipoU', sql.VarChar(100), TipoU);

        let result = await request.execute('spAltaUsuariosP');

        const Success = result.rowsAffected[0] > 0;

        res.json({Success});
    } 
    catch (error) 
    {
        console.error('Error en registrar al usuario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const registeruserM = async (req, res) => 
    {
        try 
        {
            const {Nombre, ApellidoPaterno, ApellidoMaterno, Telefono, Direccion, 
            FechaNacimiento, Especialidad, NumeroLicencia, CorreoUsuario, ContraUsuario, TipoU} = req.body;
    
            if (!Nombre || !ApellidoPaterno || !ApellidoMaterno || !Telefono || !Direccion || !Especialidad
                || !NumeroLicencia || !FechaNacimiento || !CorreoUsuario || !ContraUsuario || !TipoU) 
            {
                return res.status(400).json({ error: 'Datos son requeridos' });
            }
    
            let pool = await sql.connect(dbConfig);
            let request = pool.request();
    
            request.input('Nombre', sql.VarChar(100), Nombre);
            request.input('ApellidoPaterno', sql.VarChar(100), ApellidoPaterno);
            request.input('ApellidoMaterno', sql.VarChar(100), ApellidoMaterno);
            request.input('Telefono', sql.VarChar(15), Telefono);
            request.input('Direccion', sql.VarChar(255), Direccion);
            request.input('FechaNacimiento', sql.Date, FechaNacimiento);
            request.input('Especialidad', sql.VarChar(100), Especialidad);
            request.input('NumeroLicencia', sql.VarChar(50), NumeroLicencia);
            request.input('CorreoUsuario', sql.VarChar(100), CorreoUsuario);
            request.input('ContraUsuario', sql.VarChar(100), ContraUsuario);
            request.input('TipoU', sql.VarChar(100), TipoU);
            
            let result = await request.execute('spAltaUsuariosM');

            const Success = result.rowsAffected[0] > 0;
    
            res.json({Success});
        } 
        catch (error) 
        {
            console.error('Error en registrar al usuario:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }

    module.exports = 
    {
        verifyemail,
        registeruserP,
        registeruserM
    }