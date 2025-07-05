// src/components/GameList.js
import React from 'react';
import '../styles/GameList.css'; // Import your CSS styles

// Receive activeFilters as a prop
function GameList({ games }) {
  if (games.length === 0) {
    return (
      <div className="game-list-empty">
        <p>No encontramos juegos con tus criterios.</p>
      </div>
    );
  }

  return (
    <div className="game-list-container">
      {games.map((game, index) => {
        // Debug: log each game object
        console.log('GameList item:', game);
        if (game && (game.title || game.name)) {
          const title = game.title || game.name;
          const image = game.thumbnail_image && (game.thumbnail_image.startsWith('http://') || game.thumbnail_image.startsWith('https://'))
                ? game.thumbnail_image
                : (game.thumbnail_image ? `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg` : '');

          return (
            <div key={game.id || game.game_id || index} className="game-list-item">
              <img
                src={image}
                alt={`${title} Thumbnail`}
                className="game-list-item-thumbnail"
              />
              <div className="game-list-item-details">
                <h3 className="game-list-item-title">{title}</h3>
                <p><strong>Etiquetas:</strong> {Array.isArray(game.tags) ? game.tags.join(', ') : ''}</p>
                <p><strong>Precio:</strong> ${game.price ? Number(game.price).toFixed(2) : 'N/A'}</p>
                <p><strong>Popularidad:</strong> {game.popularity || 'N/A'} / 5</p>
                <p><strong>Año de lanzamiento:</strong> {game.releaseYear || game.release_year || 'N/A'}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="game-list-item">
              <p>Invalid game data</p>
              <pre>{JSON.stringify(game, null, 2)}</pre>
            </div>
          );
        }
      })}
    </div>
  );
}

export default GameList;