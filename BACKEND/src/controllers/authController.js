// backend/src/controllers/authController.js

const { pool } = require('../config/db'); // Importa el pool de conexiones
const bcrypt = require('bcryptjs');      // Para hashear y comparar contraseñas
const jwt = require('jsonwebtoken');     // Para generar y verificar JSON Web Tokens (JWT)

// Controlador para el registro de nuevos usuarios
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validación básica de entrada
    console.log(req.body); // Para depurar y ver qué datos se están recibiendo
    console.log(name, email, password); // Verifica los valores recibidos
    if (!name || !email || !password) {
        console.log("Error en el registro: Campos vacíos");
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // 1. Verificar si el nombre de usuario o el email ya existen en la base de datos
        console.log("Verificando si el usuario ya existe...");
        const existingUserQuery = 'SELECT * FROM users WHERE name = $1 OR email = $2';
        const resultExisting = await pool.query(existingUserQuery, [name, email]);
        const existingUserRows = resultExisting.rows;
        console.log("Usuarios existentes encontrados:", existingUserRows.length);
        if (existingUserRows.length > 0) {
            console.log("Error en el registro: Usuario o email ya en uso");
            return res.status(409).json({ message: 'El nombre de usuario o correo electrónico ya está en uso.' });
        }

        // 2. Hashear la contraseña de forma segura
        console.log("Hasheando la contraseña...");
        const salt = await bcrypt.genSalt(10); // Genera un salt con 10 rondas de hashing
        const passwordHash = await bcrypt.hash(password, salt); // Hashea la contraseña

        // 3. Insertar el nuevo usuario en la base de datos
        console.log("Insertando nuevo usuario en la base de datos...");
        const insertUserQuery = 'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id';
        const resultInsert = await pool.query(insertUserQuery, [name, email, passwordHash]);
        console.log("Usuario insertado con éxito:", resultInsert.rows[0]?.user_id);
        const userId = resultInsert.rows[0]?.user_id;

        // 4. Generar un JSON Web Token (JWT) para el usuario recién registrado
        console.log("Generando token JWT para el usuario...");
        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 5. Enviar respuesta de éxito al cliente
        res.status(201).json({ message: 'Usuario registrado con éxito.', token });

    } catch (error) {
        // Manejo de errores: Si algo sale mal durante el proceso,
        // registra el error y envía una respuesta de error al cliente.
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Controlador para el inicio de sesión de usuarios
exports.login = async (req, res) => {
    const { name, password } = req.body;
    console.log("Datos de inicio de sesión recibidos:", { name, password });
    // Validación básica de entrada
    if (!name || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña son obligatorios.' });
    }

    try {
        // 1. Buscar el usuario en la base de datos por nombre de usuario
        console.log("Buscando usuario en la base de datos...");
        const fetchUserQuery = 'SELECT * FROM users WHERE name = $1';
        const resultFetch = await pool.query(fetchUserQuery, [name]);
        console.log("Resultados de la búsqueda de usuario:", resultFetch.rows.length);
        const userRows = resultFetch.rows;
        const user = userRows[0]; // El primer (y único) resultado

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 2. Comparar la contraseña proporcionada con la contraseña hasheada en la BD
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log("Contraseña incorrecta para el usuario:", name);
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 3. Generar un JSON Web Token (JWT) para el usuario logueado
        const token = jwt.sign(
            { id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 4. Enviar respuesta de éxito al cliente con el token y datos básicos del usuario
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: { id: user.user_id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Controlador para cerrar sesión (en un sistema JWT)
exports.logout = (req, res) => {
    // En una autenticación basada en JWT, el "logout" real se maneja en el cliente.
    // El cliente simplemente elimina el token JWT de su almacenamiento (ej. localStorage).
    // El backend no necesita hacer nada a menos que implementes una lista negra de tokens (blacklist),
    // lo cual es más complejo y no es común para la mayoría de las aplicaciones.
    res.status(200).json({ message: 'Sesión cerrada exitosamente (token eliminado del cliente).' });
};