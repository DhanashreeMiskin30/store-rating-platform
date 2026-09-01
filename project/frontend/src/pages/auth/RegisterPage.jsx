import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    const nameLen = form.name.trim().length;
    if (nameLen < 20 || nameLen > 60) errs.name = 'Name must be between 20 and 60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.address.length > 400) errs.address = 'Address must not exceed 400 characters';
    if (form.password.length < 8 || form.password.length > 16) {
      errs.password = 'Password must be 8-16 characters';
    } else if (!/[A-Z]/.test(form.password)) {
      errs.password = 'Password must contain an uppercase letter';
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)) {
      errs.password = 'Password must contain a special character';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await authService.register(form);
      pushToast('Account created! You can now sign in.');
      navigate('/login');
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors) setErrors(res.errors);
      setFormError(res?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="mark">SR</div>
          <strong>Store Rating Platform</strong>
        </div>
        <h1>Create your account</h1>
        <p className="subtitle">Register as a normal user to browse and rate stores.</p>

        {formError && <div className="alert alert-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" value={form.name} onChange={update('name')} required />
            {errors.name && <span className="field-error">{errors.name}</span>}
            <span className="field-hint">20-60 characters</span>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={update('email')} required />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="address">Address</label>
            <textarea id="address" rows={3} value={form.address} onChange={update('address')} />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={update('password')} required />
            {errors.password && <span className="field-error">{errors.password}</span>}
            <span className="field-hint">8-16 characters, 1 uppercase letter, 1 special character</span>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
