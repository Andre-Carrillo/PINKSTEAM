const express = require('express');
const router = express.Router();
const GamesData = require('../data/gamesData');

// Obtener todos los juegos
router.get('/games', async (req, res) => {
    try {
        const games = await GamesData.getAll();
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los juegos' });
    }
});

// Obtener un juego por id
router.get('/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const game = await GamesData.getById(id);
        if (!game) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el juego', details: err.message });
    }
});

// Agregar un nuevo juego
router.post('/games', async (req, res) => {
    const { title, description, release_date, image } = req.body;
    if (!title || !description || !release_date || !image) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    try {
        const game = await GamesData.create(req.body);
        res.status(201).json(game);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar el juego', details: err.message });
    }
});

// Eliminar un juego por id
router.delete('/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await GamesData.delete(id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el juego', details: err.message });
    }
});

// Editar un juego por id
router.put('/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const game = await GamesData.update(id, req.body);
        if (!game) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: 'Error al editar el juego', details: err.message });
    }
});

module.exports = router;
