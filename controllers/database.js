const sql = require('mssql');
const path = require('path');
const dbConfig = require('../db/db.js');
const os = require('os');
const fs = require('fs').promises; 
const BackupPath = path.join(os.homedir(), 'Documents', 'Meditech', 'Respaldos');


const savelocalbackup = async (req, res) => {
    try {
        const {NombreArchivo} = req.body;
        const rutaCompleta = path.join(BackupPath, NombreArchivo);

        let pool = await sql.connect(dbConfig);
        let request = pool.request();
        request.input('RutaDestino', sql.VarChar(260), rutaCompleta);
        request.output('Success', sql.Int);
        request.output('Ruta', sql.VarChar(260));

        let result = await request.execute('spGuardarBackupLocal');

        res.json({
            Success: result.output.Success,
            Ruta: result.output.Ruta
        })
    } catch (err) {
        console.error('Error al guardar backup local:', err);
        res.status(500).json({ error: 'Error al guardar backup local.' });
    }
};

const uploadbackupdb = async (req, res) => {
    try {
        const { NombreArchivo, Motivo, IdUsuario, NombreUsuario } = req.body;
        const RutaCompleta = path.join(BackupPath, NombreArchivo);

        const Archivo = await fs.readFile(RutaCompleta); 

        let pool = await sql.connect(dbConfig);
        let request = pool.request();
        request.input('Nombre', sql.VarChar(255), NombreArchivo);
        request.input('Motivo', sql.VarChar(255), Motivo);
        request.input('Archivo', sql.VarBinary(sql.MAX), Archivo); 
        request.input('IdUsuario', sql.Int, IdUsuario);
        request.input('NombreUsuario', sql.VarChar(255), NombreUsuario);
        request.output('Success', sql.Bit);

        let result = await request.execute('spSubirBackupABD');

        res.json({ Success: result.output.Success });
    } catch (err) {
        console.error('Error al subir backup a BD:', err);
        res.status(500).json({ error: 'Error al subir backup a la base de datos.' });
    }
};

const getrecords = async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let request = pool.request();
        request.output('Success', sql.Bit);

        let result = await request.execute('spObtenerBackups');

        res.json({
            Success: result.output.Success,
            Backups: result.recordset
        });
    } catch (err) {
        console.error('Error al obtener backups:', err);
        res.status(500).json({ error: 'Error al obtener backups.' });
    }
};

const getfile = async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('IdBackup', sql.Int, id)
            .query('SELECT Archivo, Nombre FROM Backups WHERE IdBackup = @IdBackup');
        if (result.recordset.length === 0) {
            return res.status(404).send('Archivo no encontrado');
        }
        const archivo = result.recordset[0];
        res.setHeader('Content-Disposition', `attachment; filename=${archivo.Nombre}.bak`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(archivo.Archivo);
    } catch (err) {
        console.error('Error al obtener archivo:', err);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = {
    savelocalbackup,
    uploadbackupdb,
    getrecords,
    getfile 
};
