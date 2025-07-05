// src/contexts/GameContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// 1. Crear el contexto
export const GameContext = createContext();

// 2. Crear el Provider (proveedor de estado)
export const GameProvider = ({ children }) => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [library, setLibrary] = useState([]); // Estado de la biblioteca
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar la biblioteca del usuario desde el backend
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user || !isLoggedIn) {
        setLibrary([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/auth/games/user/" + (user.id || user.user_id));
        //const res = await axios.get(`https://pinksteam-production.up.railway.app/api/auth/games/user/${user.id || user.user_id}`);
        // Mapear los campos para que sean consistentes
        const mapped = res.data.map(game => ({
          id: game.game_id,
          title: game.name,
          image: game.thumbnail_image ? `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg` : '',
          ...game
        }));
        setLibrary(mapped);
        setError(null);
      } catch (err) {
        setLibrary([]);
        setError('No se pudo cargar tu biblioteca');
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, [user, isLoggedIn]);

  // Función para añadir juegos a la biblioteca
  const addToLibrary = async (gameId) => {
    if (!user) return;
    try {
      await axios.post(`https://pinksteam-production.up.railway.app/api/auth/games/user/${user.id || user.user_id}/add`, { game_id: gameId });
      // Refresca la biblioteca desde el backend después de añadir
      const res = await axios.get(`https://pinksteam-production.up.railway.app/api/auth/games/user/${user.id || user.user_id}`);
      const mapped = res.data.map(game => ({
        id: game.game_id,
        title: game.name,
        image: game.thumbnail_image ? `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg` : '',
        tags: Array.isArray(game.tags) ? game.tags : (typeof game.tags === 'string' ? game.tags.split(',').map(t => t.trim()) : []),
        ...game
      }));
      setLibrary(mapped);
      setError(null);
    } catch (err) {
      setError('No se pudo añadir el juego a tu biblioteca');
    }
  };

  // Eliminar juego de la biblioteca
  const removeFromLibrary = async (gameId) => {
    if (!user) return;
    try {
      await axios.post(`https://pinksteam-production.up.railway.app/api/auth/games/user/${user.id || user.user_id}/remove`, { game_id: gameId });
      // Refresca la biblioteca desde el backend después de eliminar
      const res = await axios.get(`https://pinksteam-production.up.railway.app/api/auth/games/user/${user.id || user.user_id}`);
      const mapped = res.data.map(game => ({
        id: game.game_id,
        title: game.name,
        image: game.thumbnail_image ? `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg` : '',
        tags: Array.isArray(game.tags) ? game.tags : (typeof game.tags === 'string' ? game.tags.split(',').map(t => t.trim()) : []),
        ...game
      }));
      setLibrary(mapped);
      setError(null);
    } catch (err) {
      setError('No se pudo eliminar el juego de tu biblioteca');
    }
  };

  // 3. Exportar el contexto con los valores necesarios
  return (
    <GameContext.Provider value={{ library, addToLibrary, removeFromLibrary, loading, error }}>
      {children}
    </GameContext.Provider>
  );
};