// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router(); // Crea un nuevo router de Express
const authController = require('../controllers/authController'); // Importa el controlador de autenticación
const gameRoutes = require('./gameRoutes'); // Import game routes

// Define la ruta POST para el registro de usuarios.
// Cuando se reciba una petición POST en /api/auth/register,
// se ejecutará la función 'register' del authController.
router.post('/register', authController.register);

// Define la ruta POST para el inicio de sesión de usuarios.
// Cuando se reciba una petición POST en /api/auth/login,
// se ejecutará la función 'login' del authController.
router.post('/login', authController.login);

// Define la ruta POST para cerrar sesión (opcional en JWT, pero buena práctica).
// Cuando se reciba una petición POST en /api/auth/logout,
// se ejecutará la función 'logout' del authController.
router.post('/logout', authController.logout);

// Add game routes
router.use('/games', gameRoutes);

console.log(typeof authController.register); // Should log 'function'
console.log(typeof authController.login);    // Should log 'function'
console.log(typeof authController.logout);   // Should log 'function'

module.exports = router; // Exporta el router para que app.js pueda usarlo