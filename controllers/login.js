const sql = require('mssql');
const dbConfig = require('../db/db.js'); 

const login = async (req, res) => {
    try {
        const { CorreoUsuario, ContraUsuario } = req.body;

        if (!CorreoUsuario || !ContraUsuario) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        let pool = await sql.connect(dbConfig);
        let request = pool.request();

        request.input('CorreoUsuario', sql.VarChar(50), CorreoUsuario);
        request.input('ContraUsuario', sql.VarChar(50), ContraUsuario);
        request.output('IdUsuarioLogueado', sql.Int);
        request.output('TipoU', sql.VarChar(50));

        let result = await request.execute('spLogueo');

        if (!result.output.IdUsuarioLogueado) {
            return res.status(401).json({ error: 'Credenciales incorrectas o usuario no encontrado' });
        }

        res.json({
            IdUsuarioLogueado: result.output.IdUsuarioLogueado,
            TipoU: result.output.TipoU,
        });

    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = 
{
    login
};
