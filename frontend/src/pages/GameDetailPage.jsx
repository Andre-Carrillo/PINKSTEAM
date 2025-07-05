// src/pages/GameDetailPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../contexts/GameContext';
import axios from 'axios';
import '../styles/gameDetailPage.css';

export const GameDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { library, addToLibrary, removeFromLibrary, loading } = useContext(GameContext);
    const [game, setGame] = useState(null);
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(false);
    const [allGames, setAllGames] = useState([]);

    console.log('GameDetailPage render', { id, library, allGames, game, isAddedToLibrary, loading });

    useEffect(() => {
        // Cargar todos los juegos al montar el componente
        console.log('GameDetailPage useEffect: fetching all games');
        const fetchAllGames = async () => {
            try {
                console.log('fetchAllGames: calling API');
                const res = await axios.get('https://pinksteam-production.up.railway.app/api/auth/games');
                //const res = await axios.get("http://localhost:5000/api/auth/games");
                console.log('fetchAllGames response', res.data);
                const mappedGames = res.data.map(game => ({
                    id: game.game_id,
                    title: game.name,
                    image: game.thumbnail_image && (game.thumbnail_image.startsWith('http://') || game.thumbnail_image.startsWith('https://'))
                        ? game.thumbnail_image
                        : (game.thumbnail_image ? `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg` : ''),
                    tags: game.tags ? (Array.isArray(game.tags) ? game.tags : (typeof game.tags === 'string' ? game.tags.split(',').map(t => t.trim()) : []) ) : [],
                    ...game
                }));
                console.log('fetchAllGames: mappedGames', mappedGames);
                setAllGames(mappedGames);
            } catch (err) {
                console.error('fetchAllGames error', err);
                setAllGames([]);
            }
        };
        fetchAllGames();
    }, []);

    useEffect(() => {
        const gameIdNum = parseInt(id);
        console.log('useEffect [id, library, allGames]', { id, gameIdNum, library, allGames });
        // Buscar primero en la biblioteca, si no está, buscar en todos los juegos
        let foundGame = library.find(g => g.id === gameIdNum) || allGames.find(g => g.id === gameIdNum);
        // Si el juego de la biblioteca no tiene tags, intenta encontrarlos en allGames
        if (foundGame && (!foundGame.tags || foundGame.tags.length === 0)) {
            const fromAll = allGames.find(g => g.id === gameIdNum);
            if (fromAll && fromAll.tags && fromAll.tags.length > 0) {
                foundGame = { ...foundGame, tags: fromAll.tags };
            }
        }
        setGame(foundGame || null);
        setIsAddedToLibrary(!!library.find(g => g.id === gameIdNum));
    }, [id, library, allGames]);

    const handleDownloadOrAddToLibrary = async () => {
        console.log('handleDownloadOrAddToLibrary', { game, isAddedToLibrary });
        if (!game) return;
        if (!isAddedToLibrary) {
            await addToLibrary(game.id);
            setIsAddedToLibrary(true);
            alert(`¡"${game.title}" ha sido añadido a tu biblioteca!`);
        } else {
            await removeFromLibrary(game.id);
            setIsAddedToLibrary(false);
            alert(`¡"${game.title}" ha sido eliminado de tu biblioteca!`);
        }
    };

    if (loading) {
        console.log('Loading...');
        return <div className="game-detail-container loading">Cargando detalles del juego...</div>;
    }
    if (!game) {
        console.log('No game found for id', id);
        return (
            <div className="game-detail-container loading">
                Juego no encontrado en tu biblioteca.<br/>
                <button className="btn" onClick={() => navigate('/games')}>Ver todos los juegos</button>
            </div>
        );
    }

    console.log('Rendering game details', game);

    return (
        <div className="game-detail-container">
            <header className="detail-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Volver
                </button>
                <h1>{game.title}</h1>
            </header>
            <div className="game-content-layout">
                <div className="top-section">
                    <div className="game-media">
                        <img src={game.image} alt={game.title} className="game-main-image" />
                    </div>
                    <div className="game-actions">
                        <button
                            className={`btn ${isAddedToLibrary ? 'download-btn' : 'add-to-library-btn'}`}
                            onClick={handleDownloadOrAddToLibrary}
                        >
                            {isAddedToLibrary ? 'Eliminar de la Biblioteca' : 'Añadir a la Biblioteca'}
                        </button>
                    </div>
                </div>
                <div className="game-details-main">
                    <h2 className="section-subtitle">Acerca de este juego</h2>
                    <p className="game-description">{game.description || "Descripción no disponible."}</p>
                    <div className="game-info-blocks">
                        <p><strong>Desarrollador:</strong> {game.developer || "No disponible"}</p>
                        <p><strong>Fecha de lanzamiento:</strong> {(() => {
  const dateStr = game.releaseDate || game.release_date;
  if (!dateStr) return "No disponible";
  const d = new Date(dateStr);
  if (isNaN(d)) return "No disponible";
  // Formato: YYYY-MM
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
})()}</p>
                    </div>
                    <div className="game-tags">
                        {game.tags && game.tags.length > 0 ? (
                            game.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                            ))
                        ) : (
                            <span className="tag">Sin etiquetas</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetailPage;