// src/components/GameCard.jsx
import React from "react";
import "../styles/home.css";

const GameCard = ({ image, title }) => {
  // Determinar la ruta de la imagen
  let imgSrc = game.thumbnail_image && (game.thumbnail_image.startsWith('http://') || game.thumbnail_image.startsWith('https://'))
                ? game.thumbnail_image
                : (game.thumbnail_image ? `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg` : '');
  console.log(imgSrc);
  return (
    <div className="game-card">
      <img src={imgSrc} alt={title} className="game-image" />
    </div>
  );
};

export default GameCard;
