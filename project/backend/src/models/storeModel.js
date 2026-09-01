const { pool } = require('../config/db');

async function createStore({ name, email, address, ownerId }) {
  const [result] = await pool.query(
    'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
    [name, email || null, address || null, ownerId || null]
  );
  return result.insertId;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM stores WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function findByOwnerId(ownerId) {
  const [rows] = await pool.query('SELECT * FROM stores WHERE owner_id = ? LIMIT 1', [ownerId]);
  return rows[0] || null;
}

async function countStores() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM stores');
  return rows[0].total;
}

/**
 * Paginated, filterable, sortable listing of stores with computed average
 * rating and (optionally) the requesting user's own rating for each store.
 */
async function listStores({ name, email, address, sortBy, sortOrder, page, limit, currentUserId }) {
  const allowedSort = ['name', 'email', 'address', 'rating'];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [];

  if (name) {
    conditions.push('s.name LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push('s.email LIKE ?');
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push('s.address LIKE ?');
    params.push(`%${address}%`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const orderColumn = sortColumn === 'rating' ? 'average_rating' : `s.${sortColumn}`;

  const userRatingSelect = currentUserId
    ? `(SELECT rating FROM ratings r2 WHERE r2.store_id = s.id AND r2.user_id = ${pool.escape(currentUserId)}) AS my_rating`
    : 'NULL AS my_rating';

  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
            COALESCE(AVG(r.rating), 0) AS average_rating,
            COUNT(r.id) AS rating_count,
            ${userRatingSelect}
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${whereClause}
     GROUP BY s.id
     ORDER BY ${orderColumn} ${order}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM stores s ${whereClause}`,
    params
  );

  return { rows, total: countRows[0].total };
}

async function getStoreWithRatingSummary(storeId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id,
            COALESCE(AVG(r.rating), 0) AS average_rating,
            COUNT(r.id) AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.id = ?
     GROUP BY s.id`,
    [storeId]
  );
  return rows[0] || null;
}

module.exports = {
  createStore,
  findById,
  findByOwnerId,
  countStores,
  listStores,
  getStoreWithRatingSummary
};
