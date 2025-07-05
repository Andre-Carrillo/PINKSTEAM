// src/components/RegisterForm.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // CAMBIO: de context a contexts
import axios from 'axios';
import './../styles/auth.css';
import { useNavigate } from 'react-router-dom';


const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setUsername] = useState('');
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!name || !email || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            console.log('Intentando registrar usuario:', { name, email, password });
            await axios.post('https://pinksteam-production.up.railway.app/api/auth/register', { name, email, password });
            //await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
            console.log('Registro exitoso!');
            alert('Usuario registrado con éxito. Ahora inicia sesión.');
            navigate('/login');
        } catch (err) {
            setError('Error al registrar el usuario.');
            console.error('Error durante el registro:', err);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Registrarse</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="input-group">
                <label htmlFor="register-username">Nombre de usuario</label>
                <input
                    type="text"
                    id="register-username"
                    value={name}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="register-email">Correo electrónico</label>
                <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="register-password">Contraseña</label>
                <input
                    type="password"
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="confirm-password">Confirmar Contraseña</label>
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn submit-btn">
                Registrarse
            </button>
        </form>
    );
};

RegisterForm.propTypes = {
    // Ya no se requiere onRegisterSuccess
};

export default RegisterForm;
