import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from './Modal';
import Input from './Input';

const Navbar = () => {
  const { user, logout, changePassword, isAuthenticated } = useContext(AuthContext);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated || !user) return null;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'store_owner': return 'Store Owner';
      default: return 'User';
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <a href="#" className="navbar-brand">
            Store<span>Rating</span>
          </a>
          <div className="navbar-actions">
            <div className="user-badge">
              <span>{user.name}</span>
              <span className={`badge-role role-${user.role}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>
            
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            
            <button 
              className="btn btn-danger btn-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <Modal 
          title="Change Password" 
          onClose={() => {
            setShowPasswordModal(false);
            setError('');
            setSuccess('');
          }}
        >
          <form onSubmit={handlePasswordSubmit}>
            {error && <div className="form-error" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', fontWeight: '600' }}>{success}</div>}
            
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password (8-16 chars, uppercase, symbol)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <div className="modal-footer" style={{ padding: '1rem 0 0 0', borderTop: 'none', background: 'none' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowPasswordModal(false);
                  setError('');
                  setSuccess('');
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
