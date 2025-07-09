const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Utilidad para convertir string vacío a null y parsear números
function parseOrNull(val, type = 'number') {
    if (val === undefined || val === null || val === '') return null;
    if (type === 'number') return isNaN(Number(val)) ? null : Number(val);
    return val;
}

// Obtener todos los juegos (igual que en gameRoutes, pero para admin)
router.get('/games', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM games ORDER BY game_id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los juegos' });
    }
});

// Obtener un juego por id
router.get('/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM games WHERE game_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el juego', details: err.message });
    }
});

// Agregar un nuevo juego
router.post('/games', async (req, res) => {
    let { title, description, release_date, image, type, rating, price, popularity, release_year, developer } = req.body;
    // Validación básica
    if (!title || !description || !release_date || !image) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    // Parsear campos numéricos
    rating = parseOrNull(rating);
    price = parseOrNull(price);
    popularity = parseOrNull(popularity);
    release_year = parseOrNull(release_year);
    try {
        const result = await pool.query(
            `INSERT INTO games (name, description, release_date, thumbnail_image, type, rating, price, popularity, release_year, developer)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, description, release_date, image, type, rating, price, popularity, release_year, developer]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Si es error de clave duplicada, sincroniza la secuencia y reintenta una vez
        if (err.code === '23505' && err.detail && err.detail.includes('already exists')) {
            try {
                await pool.query(`SELECT setval('games_game_id_seq', (SELECT MAX(game_id) FROM games))`);
                // Reintentar el insert
                const retryResult = await pool.query(
                    'INSERT INTO games (name, description, release_date, thumbnail_image) VALUES ($1, $2, $3, $4) RETURNING *',
                    [title, description, release_date, image]
                );
                return res.status(201).json(retryResult.rows[0]);
            } catch (retryErr) {
                console.error('Error tras sincronizar secuencia:', retryErr);
                return res.status(500).json({ error: 'Error al sincronizar la secuencia e insertar el juego', details: retryErr.message });
            }
        }
        console.error('Error al agregar el juego:', err);
        res.status(500).json({ error: 'Error al agregar el juego', details: err.message });
    }
});

// Eliminar un juego por id
router.delete('/games/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar referencias en game_labels
        await pool.query('DELETE FROM game_labels WHERE game_id = $1', [id]);
        // Eliminar referencias en game_owners
        await pool.query('DELETE FROM game_owners WHERE game_id = $1', [id]);
        // Eliminar referencias en game_platforms
        await pool.query('DELETE FROM game_platforms WHERE game_id = $1', [id]);
        await pool.query('DELETE FROM game_play_modes WHERE game_id = $1', [id]);
        // Ahora sí eliminar el juego
        await pool.query('DELETE FROM games WHERE game_id = $1', [id]);
        res.json({ message: 'Juego eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el juego:', err);
        res.status(500).json({ error: 'Error al eliminar el juego', details: err.message });
    }
});

// Editar un juego por id
router.put('/games/:id', async (req, res) => {
    const { id } = req.params;
    let { title, description, release_date, image, type, rating, price, popularity, release_year, developer } = req.body;
    // Parsear campos numéricos
    rating = parseOrNull(rating);
    price = parseOrNull(price);
    popularity = parseOrNull(popularity);
    release_year = parseOrNull(release_year);
    try {
        const result = await pool.query(
            `UPDATE games SET name = $1, description = $2, release_date = $3, thumbnail_image = $4, type = $5, rating = $6, price = $7, popularity = $8, release_year = $9, developer = $10 WHERE game_id = $11 RETURNING *`,
            [title, description, release_date, image, type, rating, price, popularity, release_year, developer, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al editar el juego:', err);
        res.status(500).json({ error: 'Error al editar el juego', details: err.message });
    }
});

module.exports = router;
