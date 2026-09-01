import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../../utils/navConfig';
import * as adminService from '../../services/adminService';

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService
      .getUserDetails(id)
      .then((res) => setUser(res.data.user))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.SYSTEM_ADMIN} title="User Details">
      <div className="page-header">
        <div>
          <h1>User Details</h1>
          <p><Link to="/admin/users">← Back to users</Link></p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading-state">Loading...</div>}

      {user && (
        <div className="card card-pad" style={{ maxWidth: 520 }}>
          <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 14 }}>
            <dt style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Name</dt>
            <dd style={{ margin: 0 }}>{user.name}</dd>
            <dt style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Email</dt>
            <dd style={{ margin: 0 }}>{user.email}</dd>
            <dt style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Address</dt>
            <dd style={{ margin: 0 }}>{user.address || '—'}</dd>
            <dt style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Role</dt>
            <dd style={{ margin: 0 }}>{user.role.replace('_', ' ')}</dd>
            {user.store && (
              <>
                <dt style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Store Name</dt>
                <dd style={{ margin: 0 }}>{user.store.name}</dd>
                <dt style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Store Avg. Rating</dt>
                <dd style={{ margin: 0 }}>{user.store.averageRating}</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </DashboardLayout>
  );
}
