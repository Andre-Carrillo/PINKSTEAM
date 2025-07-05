// src/components/LoginForm.jsx
import React, { useState, useContext } from 'react'; // Importa useContext
import axios from 'axios';

import { AuthContext } from '../contexts/AuthContext'; // Importa AuthContext
import '../styles/auth.css'; // Asegúrate de que esta ruta sea correcta para tus estilos de formularios

const LoginForm = () => { // Quita { onLoginSuccess } de la declaración de props del componente
    const [name, setName] = useState(''); // Usar 'name' en vez de 'email'
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Estado para mostrar mensajes de error al usuario

    // Obtiene la función 'login' del AuthContext. Esta función actualizará el estado global de autenticación.
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto de recarga de la página
        setError(''); // Limpiar cualquier mensaje de error anterior

        // Validación básica de campos vacíos
        if (!name || !password) {
            setError('Todos los campos son obligatorios.');
            return; // Detiene la ejecución si los campos están vacíos
        }

        // --- LÓGICA DE INICIO DE SESIÓN (SIMULADA O CON BACKEND REAL) ---
        // Aquí es donde harías la llamada a tu API/backend para autenticar al usuario.
        // Por ahora, usamos una lógica simulada para que puedas probar la funcionalidad.
        try {
            console.log('Intentando iniciar sesión con:', { name, password });
            const response = await axios.post('https://pinksteam-production.up.railway.app/api/auth/login', { name, password });
            //const response = await axios.post("http://localhost:5000/api/auth/login", { name, password }); // Cambia la URL según tu entorno
            console.log('Respuesta del servidor:', response.data);
            login(response.data.user); // Update global auth state
            console.log('Inicio de sesión exitoso!');
        } catch (err) {
            setError('Nombre de usuario o contraseña incorrectos.');
            console.error('Error durante el inicio de sesión:', err);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Iniciar Sesión</h2>
            {/* Muestra el mensaje de error si existe */}
            {error && <p className="error-message">{error}</p>}

            <div className="input-group">
                <label htmlFor="name">Nombre de usuario</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre de usuario"
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="password">Contraseña</label> {/* Etiqueta para accesibilidad */}
                <input
                    type="password"
                    id="password" // ID único para el input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña" // Placeholder más descriptivo
                    required // Hace que el campo sea obligatorio
                />
            </div>
            <button type="submit" className="btn submit-btn"> {/* Clases de botón más consistentes */}
                Iniciar Sesión
            </button>
        </form>
    );
};

// Ya NO necesitamos PropTypes para 'onLoginSuccess' ya que ya no es una prop de este componente.
LoginForm.propTypes = {
    // onLoginSuccess: PropTypes.func.isRequired, // <--- COMENTA O ELIMINA ESTA LÍNEA
};

export default LoginForm;
