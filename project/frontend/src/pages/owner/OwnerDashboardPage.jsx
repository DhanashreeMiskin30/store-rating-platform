import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../../utils/navConfig';
import * as ownerService from '../../services/ownerService';

export default function OwnerDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerService
      .getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.STORE_OWNER} title="Owner Dashboard">
      <div className="page-header">
        <div>
          <h1>{data ? data.store.name : 'Your Store'}</h1>
          <p>{data ? data.store.address : 'Ratings and reviews for your store.'}</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading-state">Loading...</div>}

      {data && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Average Rating</span>
              <span className="stat-value">{data.averageRating}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Ratings</span>
              <span className="stat-value">{data.totalRatings}</span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.raters.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-state">No ratings submitted yet</td>
                  </tr>
                )}
                {data.raters.map((r) => (
                  <tr key={r.userId}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.rating} / 5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
