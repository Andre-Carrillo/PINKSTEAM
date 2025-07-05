// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { GameContext } from "../contexts/GameContext";
import { AuthContext } from '../contexts/AuthContext';
import GameItem from '../components/GameItem';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { library } = useContext(GameContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get('https://pinksteam-production.up.railway.app/api/auth/games');
        //const res = await axios.get("http://localhost:5000/api/auth/games");
        // Map backend fields to frontend expected fields
        const mappedGames = res.data.map(game => ({
          id: game.game_id,
          title: game.name,
          image: game.thumbnail_image ? `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg` : '',
          tags: Array.isArray(game.tags) ? game.tags : (typeof game.tags === 'string' ? game.tags.split(',').map(t => t.trim()) : []),
          ...game
        }));
        setGames(mappedGames);
      } catch (err) {
        setGames([]);
      }
    };
    fetchGames();
  }, []);

  // Filtrado por búsqueda
  const filteredGames = games.filter(game =>
    game.title && game.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/games/logowo.png`} alt="logo" className="logo-img" />
          <h1 className="title">PinkSteam</h1>
        </div>
        <div className="header-buttons">
          {isLoggedIn ? (
            <>
              <button className="btn library" onClick={() => navigate("/library")}>MI BIBLIOTECA</button>
              {user && user.name === 'admin' && (
                <button className="btn admin" onClick={() => navigate("/admin/games")}>ADMIN</button>
              )}
              <span className="welcome-message">Hola, {user ? user.name : 'Usuario'}</span>
              <button className="btn logout" onClick={logout}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <button className="btn games" onClick={() => navigate("/games")}>JUEGOS</button>
              <button className="btn login" onClick={() => navigate("/login")}>INICIAR SESIÓN</button>
              <button className="btn register" onClick={() => navigate("/register")}>REGISTRARSE</button>
            </>
          )}
        </div>
      </header>
      <nav className="navbar">
        <button className="btn menu" onClick={() => navigate("/games")}>MENU</button>
        <span className="support"><i className="fa-solid fa-desktop"></i> ACERCA DE SOPORTE</span>
        <div className="game-context-test">
          <span>Biblioteca: {library.length} juegos</span>
        </div>
        <input type="text" className="search-bar" placeholder="BUSCAR" value={search} onChange={e => setSearch(e.target.value)} />
      </nav>
      <main className="main-content">
        <h2 className="section-title">NUESTROS JUEGOS ...</h2>
        <div className="game-gallery">
          {filteredGames.map((game) => (
            <div key={game.id} className="game-card-link" onClick={() => navigate(`/game/${game.id}`)}>
              <GameItem game={game} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
