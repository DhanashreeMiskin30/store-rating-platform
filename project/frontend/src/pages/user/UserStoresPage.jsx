import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../../utils/navConfig';
import StarRating from '../../components/common/StarRating';
import Pagination from '../../components/common/Pagination';
import * as storeService from '../../services/storeService';
import * as ratingService from '../../services/ratingService';
import { useToast } from '../../context/ToastContext';

export default function UserStoresPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const { pushToast } = useToast();

  const load = () => {
    setLoading(true);
    storeService
      .listStores({ search, page, limit: 8, sortBy: 'name', sortOrder: 'asc' })
      .then((res) => {
        setStores(res.data.stores);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const draftFor = (store) => (drafts[store.id] !== undefined ? drafts[store.id] : store.myRating || 0);

  const handleSave = async (store) => {
    const rating = draftFor(store);
    if (!rating) return;
    setSavingId(store.id);
    try {
      if (store.myRating) {
        await ratingService.updateRating(store.id, rating);
        pushToast('Rating updated');
      } else {
        await ratingService.submitRating(store.id, rating);
        pushToast('Rating submitted');
      }
      load();
    } catch (err) {
      pushToast(err.response?.data?.message || 'Could not save rating', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.NORMAL_USER} title="Stores">
      <div className="page-header">
        <div>
          <h1>All Stores</h1>
          <p>Browse registered stores and rate the ones you've visited.</p>
        </div>
      </div>

      <div className="table-toolbar">
        <input
          placeholder="Search by name or address"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          style={{ minWidth: 260 }}
        />
      </div>

      {loading && <div className="loading-state">Loading stores...</div>}

      {!loading && stores.length === 0 && (
        <div className="empty-state">
          <h3>No stores found</h3>
          <p>Try a different search term.</p>
        </div>
      )}

      {!loading && stores.length > 0 && (
        <div className="store-grid">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <div>
                <h3>{store.name}</h3>
                <div className="address">{store.address || 'No address on file'}</div>
              </div>
              <div className="ratings-row">
                <span>Overall Rating</span>
                <strong>{store.averageRating}</strong>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  {store.myRating ? 'Your rating' : 'Not rated yet'}
                </div>
                <StarRating value={draftFor(store)} onChange={(v) => setDrafts((d) => ({ ...d, [store.id]: v }))} />
              </div>
              <button
                className="btn btn-primary btn-sm"
                disabled={savingId === store.id || !draftFor(store)}
                onClick={() => handleSave(store)}
              >
                {savingId === store.id ? 'Saving...' : store.myRating ? 'Modify Rating' : 'Submit Rating'}
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <div className="card" style={{ marginTop: 16 }}>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={setPage} />
        </div>
      )}
    </DashboardLayout>
  );
}
