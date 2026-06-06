import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  
  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Rating Modal state
  const [selectedStore, setSelectedStore] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const fetchStores = async (searchQuery = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/stores?search=${encodeURIComponent(searchQuery)}&limit=100`);
      setStores(res.data.stores);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounced search trigger
    const delayDebounceFn = setTimeout(() => {
      fetchStores(search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenRatingModal = (store) => {
    setSelectedStore(store);
    setSelectedRating(store.userRating || 0);
    setRatingError('');
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      setRatingError('Please select a rating between 1 and 5');
      return;
    }

    setSubmittingRating(true);
    try {
      await api.post('/ratings', {
        storeId: selectedStore.id,
        rating: selectedRating
      });
      setSelectedStore(null);
      fetchStores(search); // Refresh list
    } catch (err) {
      setRatingError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="content-wrap">
        <div style={{ marginBottom: '2rem' }}>
          <h1>Welcome, {user?.name.split(' ')[0]}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Explore stores, check overall platform ratings, and write your own review feedback</p>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search stores by Name or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.875rem 1.25rem', fontSize: '1rem' }}
          />
          {search && (
            <button className="btn btn-secondary" onClick={() => setSearch('')}>
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="card" style={{ borderLeft: '4px solid var(--danger)', marginBottom: '2rem', padding: '1rem' }}>
            <span style={{ color: 'var(--danger)' }}>{error}</span>
          </div>
        )}

        {/* Loading and Stores Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: '600' }}>Searching stores...</div>
          </div>
        ) : stores.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No stores match your search criteria.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {stores.map(store => (
              <div key={store.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{store.name}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', minHeight: '40px' }}>
                    📍 {store.address}
                  </div>
                  
                  {/* Ratings Display info */}
                  <div style={{ 
                    background: 'rgba(0,0,0,0.15)', 
                    padding: '0.75rem 1rem', 
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Overall Rating:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontWeight: '700', color: store.overallRating > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {store.overallRating > 0 ? store.overallRating.toFixed(1) : 'Unrated'}
                        </span>
                        {store.overallRating > 0 && <span style={{ color: 'var(--warning)' }}>★</span>}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Your Rating:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {store.userRating ? (
                          <>
                            <span style={{ fontWeight: '700', color: 'var(--success)' }}>{store.userRating}</span>
                            <span style={{ color: 'var(--success)' }}>★</span>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not rated yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  className={`btn ${store.userRating ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ width: '100%' }}
                  onClick={() => handleOpenRatingModal(store)}
                >
                  {store.userRating ? 'Modify My Rating' : 'Rate This Store'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RATING MODAL WITH INTERACTIVE STARS */}
      {selectedStore && (
        <Modal 
          title={selectedStore.userRating ? `Modify Rating for ${selectedStore.name}` : `Submit Rating for ${selectedStore.name}`}
          onClose={() => setSelectedStore(null)}
        >
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Select a rating from 1 (poor) to 5 (excellent) stars
            </p>
            
            {ratingError && (
              <div className="form-error" style={{ marginBottom: '1rem' }}>
                {ratingError}
              </div>
            )}

            <div className="stars-container" style={{ gap: '0.75rem', marginBottom: '2rem' }}>
              {[1, 2, 3, 4, 5].map(starIndex => (
                <span
                  key={starIndex}
                  className="star-interactive"
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(starIndex)}
                  style={{
                    color: (hoverRating || selectedRating) >= starIndex ? 'var(--warning)' : 'var(--text-muted)',
                    fontSize: '2.5rem'
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '2rem', height: '24px' }}>
              {selectedRating > 0 ? (
                <>
                  Selected: <span style={{ color: 'var(--warning)' }}>{selectedRating} Star{selectedRating > 1 ? 's' : ''}</span>
                </>
              ) : 'Hover & Click to Rate'}
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none', background: 'none' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setSelectedStore(null)}
                disabled={submittingRating}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSubmitRating}
                disabled={submittingRating || selectedRating === 0}
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserDashboard;
