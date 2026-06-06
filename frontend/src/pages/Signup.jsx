import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  // Client-side validations
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (name.length < 20 || name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }
    
    // Address validation
    if (!address) {
      newErrors.address = 'Address is required';
    } else if (address.length > 400) {
      newErrors.address = 'Address cannot exceed 400 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation: 8-16 characters, 1 uppercase, 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;
    if (password.length < 8 || password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter and one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await signup(name, email, address, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Register as a normal user to rate stores</p>
        </div>
        
        {apiError && (
          <div className="form-error" style={{ marginBottom: '1.25rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {apiError}
          </div>
        )}

        {success && (
          <div style={{ 
            color: 'var(--success)', 
            backgroundColor: 'var(--success-glow)', 
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Registration successful! Redirecting to login...
          </div>
        )}
        
        <form onSubmit={handleSubmit} disabled={success}>
          <Input
            label="Full Name (20-60 characters)"
            type="text"
            id="register-name"
            placeholder="Johnathan Doe Miller Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            id="register-email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Address (Max 400 characters)"
            type="text"
            id="register-address"
            placeholder="123 Main St, Springfield, OR"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
            required
          />
          
          <Input
            label="Password (8-16 characters, uppercase + special char)"
            type="password"
            id="register-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={submitting || success}
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
