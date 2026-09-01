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
  { key: 'role', label: 'Role', sortable: true }
];

const ROLE_BADGE = {
  SYSTEM_ADMIN: 'badge-admin',
  NORMAL_USER: 'badge-user',
  STORE_OWNER: 'badge-owner'
};

export default function AdminUsersPage() {
  const { filters, updateFilter, sort, updateSort, page, setPage, buildParams } = useTableQuery({
    sort: { sortBy: 'name', sortOrder: 'asc' }
  });
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService
      .listUsers(buildParams())
      .then((res) => {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page]);

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.SYSTEM_ADMIN} title="Users">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Search, filter and sort every account on the platform.</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">+ Add User</Link>
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
        <select value={filters.role || ''} onChange={(e) => updateFilter('role', e.target.value)}>
          <option value="">All roles</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={users}
        loading={loading}
        sort={sort}
        onSortChange={updateSort}
        pagination={pagination}
        onPageChange={setPage}
        renderRow={(u) => (
          <tr key={u.id}>
            <td><Link to={`/admin/users/${u.id}`}>{u.name}</Link></td>
            <td>{u.email}</td>
            <td>{u.address || '—'}</td>
            <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role.replace('_', ' ')}</span></td>
          </tr>
        )}
      />
    </DashboardLayout>
  );
}
