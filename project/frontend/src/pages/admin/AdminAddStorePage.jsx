import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../../utils/navConfig';
import * as adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export default function AdminAddStorePage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { pushToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    adminService
      .listUsers({ role: 'STORE_OWNER', limit: 100, sortBy: 'name', sortOrder: 'asc' })
      .then((res) => setOwners(res.data.users))
      .catch(() => setOwners([]));
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setErrors({});
    setSubmitting(true);
    try {
      await adminService.createStore({ ...form, ownerId: form.ownerId ? Number(form.ownerId) : null });
      pushToast('Store created successfully');
      navigate('/admin/stores');
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) setErrors(res.errors);
      setFormError(res?.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.SYSTEM_ADMIN} title="Add Store">
      <div className="page-header">
        <div>
          <h1>Add Store</h1>
          <p>Register a new store and optionally assign an owner.</p>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 460 }}>
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Store name</label>
            <input value={form.name} onChange={update('name')} required />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="field">
            <label>Store email</label>
            <input type="email" value={form.email} onChange={update('email')} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Store address</label>
            <textarea rows={3} value={form.address} onChange={update('address')} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
          <div className="field">
            <label>Store owner</label>
            <select value={form.ownerId} onChange={update('ownerId')}>
              <option value="">No owner assigned</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
            {errors.ownerId && <span className="field-error">{errors.ownerId}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create store'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
