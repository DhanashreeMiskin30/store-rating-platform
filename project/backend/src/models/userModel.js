const { pool } = require('../config/db');

const PUBLIC_FIELDS = 'id, name, email, address, role, created_at, updated_at';

async function createUser({ name, email, passwordHash, address, role }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, address || null, role]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByIdWithPassword(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function updatePassword(id, passwordHash) {
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function countUsers() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
  return rows[0].total;
}

/**
 * Paginated, filterable, sortable listing of users for the admin panel.
 */
async function listUsers({ name, email, address, role, sortBy, sortOrder, page, limit }) {
  const allowedSort = ['name', 'email', 'address', 'role', 'created_at'];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'name';
  const order = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const params = [];

  if (name) {
    conditions.push('name LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push('email LIKE ?');
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push('address LIKE ?');
    params.push(`%${address}%`);
  }
  if (role) {
    conditions.push('role = ?');
    params.push(role);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM users ${whereClause} ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM users ${whereClause}`,
    params
  );

  return { rows, total: countRows[0].total };
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByIdWithPassword,
  updatePassword,
  countUsers,
  listUsers
};
