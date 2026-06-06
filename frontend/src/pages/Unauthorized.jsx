import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="card auth-card" style={{ textAlign: 'center', borderTop: '4px solid var(--danger)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          You do not have the required permissions to view this dashboard page.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Go to Sign In
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
