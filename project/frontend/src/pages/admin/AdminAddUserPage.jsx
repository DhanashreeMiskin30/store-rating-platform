import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../../utils/navConfig';
import * as adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export default function AdminAddUserPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setErrors({});
    setSubmitting(true);
    try {
      await adminService.createUser(form);
      pushToast('User created successfully');
      navigate('/admin/users');
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) setErrors(res.errors);
      setFormError(res?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE.SYSTEM_ADMIN} title="Add User">
      <div className="page-header">
        <div>
          <h1>Add User</h1>
          <p>Create a new account with any role.</p>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 460 }}>
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={update('name')} required />
            {errors.name && <span className="field-error">{errors.name}</span>}
            <span className="field-hint">20-60 characters</span>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} required />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={update('password')} required />
            {errors.password && <span className="field-error">{errors.password}</span>}
            <span className="field-hint">8-16 characters, 1 uppercase letter, 1 special character</span>
          </div>
          <div className="field">
            <label>Address</label>
            <textarea rows={3} value={form.address} onChange={update('address')} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
          <div className="field">
            <label>Role</label>
            <select value={form.role} onChange={update('role')}>
              <option value="NORMAL_USER">Normal User</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create user'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
