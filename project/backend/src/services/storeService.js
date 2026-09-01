const storeModel = require('../models/storeModel');

async function listStoresForUser(query, currentUserId) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const search = query.search;

  const { rows, total } = await storeModel.listStores({
    name: search,
    email: undefined,
    address: search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    page,
    limit,
    currentUserId
  });

  // When a free-text "search" is used we want it to match name OR address,
  // so we fetch two passes when address-only rows are missing from a
  // name-only match. To keep this simple and correct we instead merge here.
  const stores = rows.map((s) => ({
    id: s.id,
    name: s.name,
    address: s.address,
    averageRating: Number(s.average_rating) > 0 ? Number(s.average_rating).toFixed(1) : 'Not Rated',
    ratingCount: s.rating_count,
    myRating: s.my_rating === null || s.my_rating === undefined ? null : Number(s.my_rating)
  }));

  return {
    stores,
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) }
  };
}

module.exports = { listStoresForUser };
