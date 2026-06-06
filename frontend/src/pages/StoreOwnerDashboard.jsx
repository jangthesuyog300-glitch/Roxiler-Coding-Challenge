import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Table from '../components/Table';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  
  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stores/owner/dashboard?limit=100');
      setData(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve owner dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Columns for the ratings list table
  const ratingColumns = [
    {
      key: 'user',
      label: 'User Name',
      sortable: true,
      filterable: true,
      render: (user) => user?.name || 'Anonymous'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
      render: (_, row) => row.user?.email || 'N/A'
    },
    {
      key: 'address',
      label: 'Address',
      sortable: false,
      filterable: true,
      render: (_, row) => row.user?.address || 'N/A'
    },
    {
      key: 'rating',
      label: 'Rating Left',
      sortable: true,
      filterable: false,
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontWeight: '700', color: 'var(--warning)' }}>{rating}</span>
          <span style={{ color: 'var(--warning)' }}>★</span>
        </div>
      )
    },
    {
      key: 'updatedAt',
      label: 'Date Submitted',
      sortable: true,
      filterable: false,
      render: (date) => new Date(date).toLocaleString()
    }
  ];

  return (
    <div className="app-container">
      <Navbar />

      <div className="content-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: '600' }}>Loading owner store metrics...</div>
          </div>
        ) : error ? (
          <div className="card" style={{ borderLeft: '4px solid var(--danger)', padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Dashboard Error</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        ) : !data ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            No store metrics found.
          </div>
        ) : (
          <div>
            {/* Header info */}
            <div style={{ marginBottom: '2rem' }}>
              <h1>Dashboard: {data.store.name}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                📍 {data.store.address} | ✉️ {data.store.email}
              </p>
            </div>

            {/* Metrics cards */}
            <div className="dashboard-grid">
              <div className="card metric-card">
                <div>
                  <div className="metric-label">Average Store Rating</div>
                  <div className="metric-value">
                    {data.averageRating > 0 ? data.averageRating.toFixed(2) : '0.00'}
                  </div>
                </div>
                <div className="stars-container" style={{ fontSize: '1.5rem' }}>
                  {data.averageRating > 0 ? (
                    Array.from({ length: Math.round(data.averageRating) }).map((_, i) => (
                      <span key={i}>★</span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>☆</span>
                  )}
                </div>
              </div>

              <div className="card metric-card">
                <div>
                  <div className="metric-label">Total Submissions</div>
                  <div className="metric-value">{data.totalRatings}</div>
                </div>
                <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                  ✓
                </div>
              </div>
            </div>

            {/* Ratings table */}
            <div style={{ marginTop: '2.5rem' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>Customer Review Feedback</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                List of registered platform users who have left star ratings for your store
              </p>
              <Table 
                columns={ratingColumns} 
                data={data.ratings} 
                emptyMessage="No customers have rated your store yet." 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
