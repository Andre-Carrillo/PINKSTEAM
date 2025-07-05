// src/App.js
import React from "react";
// Ya no necesitamos importar BrowserRouter como Router aquí si ya está en index.js
import { Routes, Route } from "react-router-dom"; 

// Importa los Providers de tus contextos
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext'; // Asegúrate que esta ruta sea correcta

// Importa tus componentes de página
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GamesPage from "./pages/GamesPage";
import LibraryPage from "./pages/LibraryPage";
import GameDetailPage from "./pages/GameDetailPage";
import AdminGamesPage from "./pages/AdminGamesPage";

function App() {
  return (
    // Hemos eliminado <Router> aquí. Si ya lo tienes en index.js, esto lo soluciona.
    // Si no lo tienes en index.js, entonces deberías ponerlo a este nivel.
    // Pero el error indica que ya existe uno en un nivel superior.
    <AuthProvider> {/* Envuelve toda tu aplicación con AuthProvider */}
      <GameProvider> {/* Envuelve con GameProvider */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/admin/games" element={<AdminGamesPage />} />
        </Routes>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;