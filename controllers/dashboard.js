const sql = require('mssql');
const dbConfig = require('../db/db.js'); 
const { query } = require('express');

const getuser = async (req, res) => {
    try {
        const { IdUsuario } = req.body;

        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('IdUsuario', sql.Int, IdUsuario);

        let result = await request.query(
            "SELECT Nombre, ApellidoPaterno, ApellidoMaterno FROM Usuario WHERE IdUsuario = @IdUsuario"
        );

        const Success = result.rowsAffected[0] > 0;

        if (result.rowsAffected[0] > 0 && result.recordset.length > 0) {
            let NombreU = result.recordset[0].Nombre;
            let ApellidoPaterno = result.recordset[0].ApellidoPaterno;
            let ApellidoMaterno = result.recordset[0].ApellidoMaterno
            res.json({NombreU, ApellidoPaterno, ApellidoMaterno, Success});
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

const userdatap = async (req, res) => {
    try {
        const { Id } = req.body;

        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('Id', sql.Int, Id);

        let result = await request.query(
            "SELECT IdUsuario, Nombre, ApellidoPaterno, ApellidoMaterno, Correo, Contraseña, Telefono, Direccion, FechaNacimiento FROM Usuario WHERE IdUsuario = @Id"
        );

        if (result.recordset.length > 0) {
            let info = result.recordset[0]; 
            res.json({
                IdUsuario: info.IdUsuario,
                Nombre: info.Nombre,
                ApellidoPaterno: info.ApellidoPaterno,
                ApellidoMaterno: info.ApellidoMaterno,
                Correo: info.Correo,
                Contraseña: info.Contraseña,
                Telefono: info.Telefono,
                Direccion: info.Direccion,
                FechaNacimiento: info.FechaNacimiento,
                Success: true
            });
        } else {
            res.status(404).json({ error: "Usuario no encontrado", Success: false });
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

const modifyuserdatap = async (req, res) => 
{
    try 
    {
        const {IdUsuario, Nombre, ApellidoPaterno, ApellidoMaterno, 
            CorreoUsuario, ContraUsuario, Telefono, Direccion, FechaNacimiento} = req.body;
        
        if (!IdUsuario || !Nombre || !ApellidoPaterno || !ApellidoMaterno || 
            !CorreoUsuario || !ContraUsuario || !Telefono || !Direccion || !FechaNacimiento)
        {
            return res.status(400).json({ error: 'Datos son requeridos' });
        }

        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('IdUsuario', sql.Int, IdUsuario);
        request.input('Nombre', sql.VarChar(100), Nombre);
        request.input('ApellidoPaterno', sql.VarChar(100), ApellidoPaterno);
        request.input('ApellidoMaterno', sql.VarChar(100), ApellidoMaterno);
        request.input('CorreoUsuario', sql.VarChar(100), CorreoUsuario);
        request.input('ContraUsuario', sql.VarChar(100), ContraUsuario);     
        request.input('Telefono', sql.VarChar(15), Telefono);
        request.input('Direccion', sql.VarChar(255), Direccion);
        request.input('FechaNacimiento', sql.Date, FechaNacimiento)

        let result = await request.execute('spModificarUsuarioP');

        const Success = result.rowsAffected[0] > 0;
         
        res.json({Success});
    } catch (error) {
        console.error("Error al modificar usuario:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

module.exports =
{
    getuser,
    userdatap,
    modifyuserdatap
};