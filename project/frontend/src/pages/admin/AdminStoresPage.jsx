import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../../utils/navConfig';
import DataTable from '../../components/tables/DataTable';
import useTableQuery from '../../hooks/useTableQuery';
import * as adminService from '../../services/adminService';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true }
];

export default function AdminStoresPage() {
  const { filters, updateFilter, sort, updateSort, page, setPage, buildParams } = useTableQuery({
    sort: { sortBy: 'name', sortOrder: 'asc' }
  });
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService
      .listStores(buildParams())
      .then((res) => {
        setStores(res.data.stores);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page]);

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.SYSTEM_ADMIN} title="Stores">
      <div className="page-header">
        <div>
          <h1>Stores</h1>
          <p>Search, filter and sort every registered store.</p>
        </div>
        <Link to="/admin/stores/new" className="btn btn-primary">+ Add Store</Link>
      </div>

      <div className="table-toolbar">
        <input
          placeholder="Search by name"
          value={filters.name || ''}
          onChange={(e) => updateFilter('name', e.target.value)}
        />
        <input
          placeholder="Search by email"
          value={filters.email || ''}
          onChange={(e) => updateFilter('email', e.target.value)}
        />
        <input
          placeholder="Search by address"
          value={filters.address || ''}
          onChange={(e) => updateFilter('address', e.target.value)}
        />
      </div>

      <DataTable
        columns={COLUMNS}
        rows={stores}
        loading={loading}
        sort={sort}
        onSortChange={updateSort}
        pagination={pagination}
        onPageChange={setPage}
        renderRow={(s) => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.email || '—'}</td>
            <td>{s.address || '—'}</td>
            <td>{s.averageRating}</td>
          </tr>
        )}
      />
    </DashboardLayout>
  );
}
