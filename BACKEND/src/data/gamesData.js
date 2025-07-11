const { pool } = require('../config/db');

function parseOrNull(val, type = 'number') {
    if (val === undefined || val === null || val === '') return null;
    if (type === 'number') return isNaN(Number(val)) ? null : Number(val);
    return val;
}

const GamesData = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM games ORDER BY game_id');
        return result.rows;
    },
    getById: async (id) => {
        const result = await pool.query('SELECT * FROM games WHERE game_id = $1', [id]);
        return result.rows[0];
    },
    create: async (data) => {
        let { title, description, release_date, image, type, rating, price, popularity, release_year, developer } = data;
        rating = parseOrNull(rating);
        price = parseOrNull(price);
        popularity = parseOrNull(popularity);
        release_year = parseOrNull(release_year);
        const result = await pool.query(
            `INSERT INTO games (name, description, release_date, thumbnail_image, type, rating, price, popularity, release_year, developer)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, description, release_date, image, type, rating, price, popularity, release_year, developer]
        );
        return result.rows[0];
    },
    update: async (id, data) => {
        let { title, description, release_date, image, type, rating, price, popularity, release_year, developer } = data;
        rating = parseOrNull(rating);
        price = parseOrNull(price);
        popularity = parseOrNull(popularity);
        release_year = parseOrNull(release_year);
        const result = await pool.query(
            `UPDATE games SET name = $1, description = $2, release_date = $3, thumbnail_image = $4, type = $5, rating = $6, price = $7, popularity = $8, release_year = $9, developer = $10 WHERE game_id = $11 RETURNING *`,
            [title, description, release_date, image, type, rating, price, popularity, release_year, developer, id]
        );
        return result.rows[0];
    },
    delete: async (id) => {
        await pool.query('DELETE FROM game_labels WHERE game_id = $1', [id]);
        await pool.query('DELETE FROM game_owners WHERE game_id = $1', [id]);
        await pool.query('DELETE FROM game_platforms WHERE game_id = $1', [id]);
        await pool.query('DELETE FROM game_play_modes WHERE game_id = $1', [id]);
        await pool.query('DELETE FROM games WHERE game_id = $1', [id]);
        return { message: 'Juego eliminado correctamente' };
    }
};

module.exports = GamesData;
