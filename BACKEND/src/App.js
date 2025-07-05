// backend/src/app.js

// Carga las variables de entorno desde el archivo .env.
// Esto debe hacerse lo más pronto posible en tu aplicación.
require('dotenv').config();

// Importa el framework Express.
const express = require('express');
// Importa el middleware CORS para manejar las políticas de seguridad de origen cruzado.
// Esto es necesario para que tu frontend (que corre en un puerto diferente)
// pueda hacer peticiones a tu backend.
const cors = require('cors');
// Importa el pool de conexiones y la función de prueba de conexión a la base de datos.
const { testDbConnection } = require('./config/db');
// Importa tus archivos de rutas. Los crearemos en el siguiente paso.
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
//const userRoutes = require('./routes/userRoutes'); // Si tienes rutas para la gestión de usuarios

// Crea una instancia de la aplicación Express.
const app = express();
// Define el puerto en el que tu servidor escuchará.
// Tomará el puerto de las variables de entorno o usará 5000 como predeterminado.
const PORT = process.env.PORT || 5000;

// --- Middleware Globales ---
// Habilita CORS para todas las peticiones.
app.use(cors());
// Habilita el parser de JSON para que Express pueda leer el cuerpo de las peticiones
// que vengan en formato JSON (ej. datos enviados desde el frontend en un POST).
app.use(express.json());

// --- Rutas de la API ---
// Define los prefijos de las rutas y asocia los routers correspondientes.
// Todas las rutas definidas en authRoutes.js serán prefijadas con /api/auth.
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// Todas las rutas definidas en userRoutes.js serán prefijadas con /api/users.
//app.use('/api/users', userRoutes); // Ejemplo de rutas para usuarios

// --- Ruta de Prueba ---
// Una ruta simple para verificar que el servidor está funcionando.
app.get('/', (req, res) => {
    res.send('Backend de React y MySQL funcionando!');
});

// --- Inicio del Servidor ---
// Función asíncrona para iniciar el servidor.
async function startServer() {
    // Primero, intenta conectar a la base de datos.
    // Si la conexión falla, la aplicación se detendrá aquí (ver db.js).
    await testDbConnection();
    // Si la conexión es exitosa, inicia el servidor Express para escuchar peticiones.
    app.listen(PORT, () => {
        console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
}

// Llama a la función para iniciar el servidor.
startServer();