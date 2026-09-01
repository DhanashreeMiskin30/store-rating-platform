const { pool } = require('../config/db');

async function findByUserAndStore(userId, storeId) {
  const [rows] = await pool.query(
    'SELECT * FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1',
    [userId, storeId]
  );
  return rows[0] || null;
}

async function createRating({ userId, storeId, rating }) {
  const [result] = await pool.query(
    'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
    [userId, storeId, rating]
  );
  return result.insertId;
}

async function updateRating({ userId, storeId, rating }) {
  await pool.query(
    'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
    [rating, userId, storeId]
  );
}

async function countRatings() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM ratings');
  return rows[0].total;
}

/**
 * All ratings for a given store, joined with the rating user's public info.
 * Used by the store-owner dashboard. Never exposes password data.
 */
async function listRatingsForStore(storeId) {
  const [rows] = await pool.query(
    `SELECT r.id, r.rating, r.created_at, r.updated_at,
            u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = ?
     ORDER BY r.created_at DESC`,
    [storeId]
  );
  return rows;
}

module.exports = {
  findByUserAndStore,
  createRating,
  updateRating,
  countRatings,
  listRatingsForStore
};
