require('dotenv').config({ path: 'databaseconfig.env' });
console.log('🔍 DB_SERVER:', process.env.DB_SERVER);
console.log('🔍 DB_USER:', process.env.DB_USER);
console.log('🔍 DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('🔍 DB_DATABASE:', process.env.DB_DATABASE);
console.log('🔍 DB_PORT:', process.env.DB_PORT);

const express = require('express');
const cors = require('cors');
const { sql, connectDB } = require('./db/db.js');
const rutas = require('./routes/routes.js'); 


const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', rutas); 

app.get('/', (req, res) => {
    res.send('🚀 Servidor Node.js conectado a SQL Server');
});
app.listen(PORT, '0.0.0.0', async () => {
    await connectDB();
    console.log(`🚀 Servidor corriendo en http://192.168.0.109:${PORT}`);
});
