import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as authService from '../services/authService';
import DashboardLayout from '../layouts/DashboardLayout';
import { NAV_ITEMS_BY_ROLE } from '../utils/navConfig';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword !== form.confirmNewPassword) {
      setError('New password and confirmation do not match');
      return;
    }
    setSubmitting(true);
    try {
      await authService.changePassword(form);
      pushToast('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS_BY_ROLE[user?.role] || []} title="Change Password">
      <div className="page-header">
        <div>
          <h1>Change Password</h1>
          <p>Update the password used to sign in to your account.</p>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 460 }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Current password</label>
            <input type="password" value={form.currentPassword} onChange={update('currentPassword')} required />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" value={form.newPassword} onChange={update('newPassword')} required />
            <span className="field-hint">8-16 characters, 1 uppercase letter, 1 special character</span>
          </div>
          <div className="field">
            <label>Confirm new password</label>
            <input type="password" value={form.confirmNewPassword} onChange={update('confirmNewPassword')} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
