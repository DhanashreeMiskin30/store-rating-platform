import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../../utils/navConfig';
import * as adminService from '../../services/adminService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.SYSTEM_ADMIN} title="Admin Dashboard">
      <div className="page-header">
        <div>
          <h1>Overview</h1>
          <p>Platform-wide statistics, pulled live from the database.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading-state">Loading dashboard...</div>}

      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats.totalUsers}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Stores</span>
            <span className="stat-value">{stats.totalStores}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Ratings</span>
            <span className="stat-value">{stats.totalRatings}</span>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
