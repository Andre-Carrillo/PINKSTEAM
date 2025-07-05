// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// 1. Crear el contexto de autenticación
export const AuthContext = createContext(null);

// 2. Crear el componente proveedor de autenticación
export const AuthProvider = ({ children }) => {
    // Estado para saber si el usuario está logueado
    // Inicialmente, intentamos obtener el estado de localStorage (para persistencia simple)
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoginStatus = localStorage.getItem('isLoggedIn');
        return storedLoginStatus === 'true'; // Convertir string a booleano
    });
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Efecto para guardar el estado de login en localStorage cada vez que cambia
    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [isLoggedIn, user]);

    // Función para iniciar sesión
    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
    };

    // Función para cerrar sesión
    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    // El valor que se proporcionará a los componentes que consuman este contexto
    const authContextValue = {
        isLoggedIn,
        user,
        isAdmin: user?.name === 'admin', // Solo el usuario con nombre 'admin' es admin
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};