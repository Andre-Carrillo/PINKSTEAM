import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import '../styles/AdminGamesPage.css';

const AdminGamesPage = () => {
    const { isLoggedIn, isAdmin } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        release_date: '',
        image: '',
        tags: '',
        platforms: '',
        type: '',
        rating: '',
        price: '',
        popularity: '',
        release_year: '',
        developer: ''
    });
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await fetch('https://pinksteam-production.up.railway.app/api/admin/games');
            if (response.ok) {
                const data = await response.json();
                setGames(data);
            } else {
                throw new Error('Error al cargar los juegos');
            }
        } catch (error) {
            setMessage('Error al cargar los juegos: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const gameData = {
                title: formData.title,
                description: formData.description,
                release_date: formData.release_date,
                image: formData.image,
                type: formData.type,
                rating: formData.rating,
                price: formData.price,
                popularity: formData.popularity,
                release_year: formData.release_year,
                developer: formData.developer
            };

            const response = await fetch('https://pinksteam-production.up.railway.app/api/admin/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
            });

            if (response.ok) {
                setMessage('Juego agregado exitosamente');
                setFormData({
                    title: '',
                    description: '',
                    release_date: '',
                    image: '',
                    tags: '',
                    platforms: '',
                    type: '',
                    rating: '',
                    price: '',
                    popularity: '',
                    release_year: '',
                    developer: ''
                });
                fetchGames(); // Refresh the games list
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al agregar el juego');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Eliminar juego
    const handleDelete = async (gameId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este juego?')) return;
        try {
            const response = await fetch(`https://pinksteam-production.up.railway.app/api/admin/games/${gameId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage('Juego eliminado correctamente');
                fetchGames();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar el juego');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    // Editar juego (cargar datos en el formulario)
    const handleEdit = (game) => {
        setFormData({
            title: game.name || game.title || '',
            description: game.description || '',
            release_date: game.release_date ? game.release_date.slice(0, 10) : '',
            image: game.thumbnail_image || game.image || '',
            tags: '',
            platforms: '',
            type: game.type || '',
            rating: game.rating || '',
            price: game.price || '',
            popularity: game.popularity || '',
            release_year: game.release_year || '',
            developer: game.developer || ''
        });
        setEditingId(game.game_id || game.id);
    };

    // Guardar edición
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingId) return;
        try {
            const gameData = {
                title: formData.title,
                description: formData.description,
                release_date: formData.release_date,
                image: formData.image,
                type: formData.type,
                rating: formData.rating,
                price: formData.price,
                popularity: formData.popularity,
                release_year: formData.release_year,
                developer: formData.developer
            };
            const response = await fetch(`https://pinksteam-production.up.railway.app/api/admin/games/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)
            });
            if (response.ok) {
                setMessage('Juego actualizado correctamente');
                setFormData({ title: '', description: '', release_date: '', image: '', tags: '', platforms: '', type: '', rating: '', price: '', popularity: '', release_year: '', developer: '' });
                setEditingId(null);
                fetchGames();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar el juego');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    // Mover los returns condicionales después de los hooks
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    <h2>Acceso Restringido</h2>
                    <p>Lo sentimos, esta página está reservada para administradores.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-games-bg">
            <div className="admin-games-container">
                <h2 className="admin-games-title">Panel de Administración de Juegos</h2>
                {message && (
                    <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} admin-games-alert`}>
                        {message}
                    </div>
                )}
                <div className="admin-games-row">
                    <div className="col-12 col-lg-5 mb-4 mb-lg-0 d-flex">
                        <div className="card admin-games-form-card flex-fill">
                            <div className="admin-games-card-body">
                                <h3 className="admin-games-form-title">Agregar / Editar Juego</h3>
                                <form onSubmit={editingId ? handleUpdate : handleSubmit}>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            {/* Título, Tipo, Rating, Precio, Popularidad */}
                                            <div className="mb-3">
                                                <label className="form-label">Título</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Tipo</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                    placeholder="Ej: Acción, Aventura"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Rating</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="rating"
                                                    value={formData.rating}
                                                    onChange={handleChange}
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    placeholder="Ej: 8.5"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Precio</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Ej: 59.99"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Popularidad</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="popularity"
                                                    value={formData.popularity}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder="Ej: 1000"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            {/* Año, Fecha, Desarrollador, Imagen, Etiquetas, Plataformas */}
                                            <div className="mb-3">
                                                <label className="form-label">Fecha de Lanzamiento</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="release_date"
                                                    value={formData.release_date}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Desarrollador</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="developer"
                                                    value={formData.developer}
                                                    onChange={handleChange}
                                                    placeholder="Ej: Nintendo, FromSoftware"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">URL o Nombre de la Imagen</label>
                                                {/* Vista previa de la imagen si es una URL válida */}
                                                {formData.image && (formData.image.startsWith('http://') || formData.image.startsWith('https://')) && (
                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <img src={formData.image} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ccc' }} />
                                                    </div>
                                                )}
                                                {/* Vista previa si es un nombre de archivo local */}
                                                {formData.image && !(formData.image.startsWith('http://') || formData.image.startsWith('https://')) && (
                                                    <div style={{ marginBottom: '1rem' }}>
                                                        <img src={`${process.env.PUBLIC_URL}/games/${formData.image}`} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ccc' }} />
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="image"
                                                    value={formData.image}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="URL completa o nombre de archivo (ej: apex.jpg)"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Etiquetas (separadas por comas)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="tags"
                                                    value={formData.tags}
                                                    onChange={handleChange}
                                                    placeholder="RPG, Acción, Aventura"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Plataformas (separadas por comas)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="platforms"
                                                    value={formData.platforms}
                                                    onChange={handleChange}
                                                    placeholder="PC, PS5, Xbox Series X"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Año de Lanzamiento</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="release_year"
                                                    value={formData.release_year}
                                                    onChange={handleChange}
                                                    min="1970"
                                                    max="2100"
                                                    placeholder="Ej: 2023"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mt-4">
                                        <button type="submit" className="btn admin-games-btn-pink px-4" style={{ fontSize: 18 }}>
                                            {editingId ? 'Guardar Cambios' : 'Agregar Juego'}
                                        </button>
                                        {editingId && (
                                            <button type="button" className="btn btn-secondary ms-2 px-4 admin-games-btn-cancel" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', release_date: '', image: '', tags: '', platforms: '', type: '', rating: '', price: '', popularity: '', release_year: '', developer: '' }); }}>
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-7 d-flex">
                        <div className="card admin-games-list-card flex-fill">
                            <div className="admin-games-card-body">
                                <h3 className="admin-games-list-title">Lista de Juegos</h3>
                                <div className="table-responsive">
                                    <table className="table align-middle table-hover admin-games-table">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Imagen</th>
                                                <th>Título</th>
                                                <th>Precio</th>
                                                <th>Rating</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {games.map(game => {
                                                let imgSrc = '';
                                                if (game.thumbnail_image && (game.thumbnail_image.startsWith('http://') || game.thumbnail_image.startsWith('https://'))) {
                                                    imgSrc = game.thumbnail_image;
                                                } else if (game.thumbnail_image) {
                                                    imgSrc = `${process.env.PUBLIC_URL}/games/${game.thumbnail_image}.jpg`;
                                                } else if (game.image && (game.image.startsWith('http://') || game.image.startsWith('https://'))) {
                                                    imgSrc = game.image;
                                                } else if (game.image) {
                                                    imgSrc = `${process.env.PUBLIC_URL}/games/${game.image}.jpg`;
                                                }
                                                return (
                                                    <tr key={game.id || game.game_id}>
                                                        <td>
                                                            {imgSrc && <img src={imgSrc} alt={game.title || game.name} className="admin-games-img" />}
                                                        </td>
                                                        <td style={{ fontWeight: 600 }}>{game.title || game.name}</td>
                                                        <td>{game.price ? `$${parseFloat(game.price).toFixed(2)}` : '-'}</td>
                                                        <td>{game.rating || '-'}</td>
                                                        <td>
                                                            <button className="btn btn-sm admin-games-btn-pink me-2" onClick={() => handleEdit(game)}>Editar</button>
                                                            <button className="btn btn-sm btn-danger admin-games-btn-cancel" onClick={() => handleDelete(game.game_id || game.id)}>Eliminar</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGamesPage;
