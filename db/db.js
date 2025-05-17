require('dotenv').config({ path: '../databaseconfig.env' });
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false, 
        trustServerCertificate: true,
    }
};

async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log('✅ Conectado a SQL Server en', dbConfig.server);
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
    }
}

module.exports = { sql, connectDB };
