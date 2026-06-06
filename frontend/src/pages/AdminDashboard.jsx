import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  
  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // For detailed info modal

  // Create User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });
  const [userFormError, setUserFormError] = useState('');
  
  // Create Store Form State
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [storeFormError, setStoreFormError] = useState('');

  // Fetch metrics, users and stores
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch metrics
      const metricsRes = await api.get('/users/metrics');
      setMetrics(metricsRes.data.metrics);

      // 2. Fetch users list (get large page to allow local sorting/filtering)
      const usersRes = await api.get('/users?limit=100');
      setUsers(usersRes.data.users);

      // 3. Fetch stores list
      const storesRes = await api.get('/stores?limit=100');
      setStores(storesRes.data.stores);

      // 4. Fetch store owners for the dropdown selector
      const ownersRes = await api.get('/users?role=store_owner&limit=100');
      setStoreOwners(ownersRes.data.users);
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserFormError('');
    
    // Client-side validations
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      setUserFormError('Name must be 20 to 60 characters');
      return;
    }
    if (newUser.address.length > 400) {
      setUserFormError('Address cannot exceed 400 characters');
      return;
    }
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;
    if (newUser.password.length < 8 || newUser.password.length > 16 || !pwdRegex.test(newUser.password)) {
      setUserFormError('Password must be 8-16 chars and contain at least one uppercase letter and one special character');
      return;
    }

    try {
      await api.post('/users', newUser);
      setShowUserModal(false);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchData(); // Refresh list & metrics
    } catch (err) {
      setUserFormError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setStoreFormError('');

    if (newStore.name.length < 20 || newStore.name.length > 60) {
      setStoreFormError('Store name must be 20 to 60 characters');
      return;
    }
    if (newStore.address.length > 400) {
      setStoreFormError('Address cannot exceed 400 characters');
      return;
    }
    if (!newStore.ownerId) {
      setStoreFormError('Please select a store owner');
      return;
    }

    try {
      await api.post('/stores', newStore);
      setShowStoreModal(false);
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      fetchData(); // Refresh list & metrics
    } catch (err) {
      setStoreFormError(err.response?.data?.message || 'Failed to create store');
    }
  };

  // User table columns definition
  const userColumns = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'address', label: 'Address', sortable: false, filterable: true },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true, 
      filterable: true,
      render: (role) => {
        let styleClass = 'role-user';
        if (role === 'admin') styleClass = 'role-admin';
        if (role === 'store_owner') styleClass = 'role-store_owner';
        return <span className={`badge-role ${styleClass}`}>{role.replace('_', ' ')}</span>;
      }
    },
    {
      key: 'actions',
      label: 'Details',
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => setSelectedUser(row)}
        >
          View
        </button>
      )
    }
  ];

  // Store table columns definition
  const storeColumns = [
    { key: 'name', label: 'Store Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'address', label: 'Address', sortable: false, filterable: true },
    { 
      key: 'overallRating', 
      label: 'Overall Rating', 
      sortable: true, 
      filterable: false,
      render: (rating) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: '700', color: rating > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
            {rating > 0 ? rating.toFixed(1) : 'No ratings'}
          </span>
          {rating > 0 && <span style={{ color: 'var(--warning)' }}>★</span>}
        </div>
      )
    },
    {
      key: 'owner',
      label: 'Store Owner',
      sortable: true,
      filterable: true,
      render: (owner) => owner?.name || 'N/A'
    }
  ];

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="content-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Admin Control Panel</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage store listings, users, and review platform statistics</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setShowUserModal(true)}>
              + Add User
            </button>
            <button className="btn btn-primary" onClick={() => setShowStoreModal(true)}>
              + Add Store
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ borderLeft: '4px solid var(--danger)', marginBottom: '2rem', padding: '1rem' }}>
            <span style={{ color: 'var(--danger)' }}>{error}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="dashboard-grid">
          <div className="card metric-card">
            <div>
              <div className="metric-label">Total Users</div>
              <div className="metric-value">{metrics.totalUsers}</div>
            </div>
            <div className="metric-icon">👥</div>
          </div>
          
          <div className="card metric-card">
            <div>
              <div className="metric-label">Total Stores</div>
              <div className="metric-value">{metrics.totalStores}</div>
            </div>
            <div className="metric-icon">🏪</div>
          </div>
          
          <div className="card metric-card">
            <div>
              <div className="metric-label">Total Ratings</div>
              <div className="metric-value">{metrics.totalRatings}</div>
            </div>
            <div className="metric-icon">★</div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: '600' }}>Loading platform records...</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Manage Users Section */}
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>Platform Users</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>View, sort, filter, and review details of all registered profiles</p>
              <Table columns={userColumns} data={users} emptyMessage="No user profiles registered" />
            </div>

            {/* Manage Stores Section */}
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>Store Registrations</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Manage system-registered commercial stores and current ratings</p>
              <Table columns={storeColumns} data={stores} emptyMessage="No store listings added" />
            </div>
            
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {showUserModal && (
        <Modal title="Add User Account" onClose={() => setShowUserModal(false)}>
          <form onSubmit={handleCreateUser}>
            {userFormError && <div className="form-error" style={{ marginBottom: '1rem' }}>{userFormError}</div>}
            
            <Input
              label="Full Name (20-60 characters)"
              placeholder="e.g. System Administrator Account Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <Input
              label="Address (Max 400 characters)"
              placeholder="123 Road Drive, City, State"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              required
            />
            <Input
              label="Account Password"
              type="password"
              placeholder="••••••••"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            
            <div className="form-group">
              <label className="form-label">System Role</label>
              <select 
                className="filter-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none', background: 'none' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create User</button>
            </div>
          </form>
        </Modal>
      )}

      {/* CREATE STORE MODAL */}
      {showStoreModal && (
        <Modal title="Register Store Listing" onClose={() => setShowStoreModal(false)}>
          <form onSubmit={handleCreateStore}>
            {storeFormError && <div className="form-error" style={{ marginBottom: '1rem' }}>{storeFormError}</div>}

            <Input
              label="Store Name (20-60 characters)"
              placeholder="e.g. Supermarket Alpha Brand Store"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              required
            />
            <Input
              label="Store Contact Email"
              type="email"
              placeholder="contact@storename.com"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              required
            />
            <Input
              label="Store Physical Address"
              placeholder="Store Mall Unit, City, State"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              required
            />

            <div className="form-group">
              <label className="form-label">Assign Store Owner</label>
              {storeOwners.length === 0 ? (
                <div className="form-error">No unassigned Store Owners found. Add one in "Add User" first.</div>
              ) : (
                <select 
                  className="filter-select"
                  value={newStore.ownerId}
                  onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Owner --</option>
                  {storeOwners.map(owner => (
                    <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none', background: 'none' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowStoreModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={storeOwners.length === 0}>Create Store</button>
            </div>
          </form>
        </Modal>
      )}

      {/* USER DETAILED INFO MODAL */}
      {selectedUser && (
        <Modal title="User Profile Details" onClose={() => setSelectedUser(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>UUID</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.25rem' }}>{selectedUser.id}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Name</strong>
              <div style={{ fontSize: '1rem', fontWeight: '600', marginTop: '0.25rem' }}>{selectedUser.name}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email</strong>
              <div style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{selectedUser.email}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Address</strong>
              <div style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{selectedUser.address}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>System Role</strong>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge-role role-${selectedUser.role}`}>{selectedUser.role.replace('_', ' ')}</span>
              </div>
            </div>
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Created Date</strong>
              <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{new Date(selectedUser.createdAt).toLocaleString()}</div>
            </div>
          </div>
          <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none', background: 'none' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
