import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { refreshAccessToken } from '../utils/auth';
import { fetchAndStoreProfile } from '../utils/profileManager';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Check on resize
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Track mouse position (only on non-mobile)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  // Set document title
  useEffect(() => {
    document.title = 'Login | AUTOMEET';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for handling cookies
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Store non-sensitive user data
      localStorage.setItem('user', JSON.stringify({
        username: data.username,
        isAdmin: data.isAdmin,
        role: data.role
      }));

      // Fetch and store profile data
      await fetchAndStoreProfile();

      // Set up token refresh
      setupTokenRefresh();

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Setup automatic token refresh
  const setupTokenRefresh = () => {
    // Refresh every 14 minutes (token expires in 15)
    const REFRESH_INTERVAL = 14 * 60 * 1000;
    
    const refreshInterval = setInterval(async () => {
      const success = await refreshAccessToken();
      if (!success) {
        clearInterval(refreshInterval);
        localStorage.removeItem('user');
        navigate('/login');
      }
    }, REFRESH_INTERVAL);

    // Store interval ID for cleanup
    window.refreshTokenInterval = refreshInterval;

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(window.refreshTokenInterval);
    });
  };

  // Initial token refresh check
  useEffect(() => {
    const checkAuth = async () => {
      const success = await refreshAccessToken();
      if (success) {
        navigate('/');
      }
    };

    if (localStorage.getItem('user')) {
      checkAuth();
    }
  }, [navigate]);

  // Google Sign-In handler
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  };

  return (
    
     
        
        <div 
          className="d-flex align-items-center justify-content-center position-relative" 
      style={{
        width: '500px',
        height: 'auto',
        minHeight: '600px',
        padding: '20px',
        margin: '0 auto',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'url("/icons/background.png")',
        backgroundSize: 'cover',
        transition: 'background-position 0.3s ease-out',
        backgroundRepeat: 'no-repeat',
      }}
          
          
        >
          <div 
            className="bg-white shadow-lg rounded-4 p-4 m-3 position-relative" 
            style={{ 
              width: '100%', 
              maxWidth: '450px', 
              zIndex: 10 
            }}
          >
            <h2 className="fw-bold mb-1">Welcome Back!</h2>
            <p className="text-muted mb-4">Sign in to your account</p>
            
            {error && <div className="alert alert-danger py-2">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="input-group text-secondary bg-white rounded-pill px-3" 
                    style={{ border: "2px solid #dee2e6" }}>
                    <span className="input-group-text text-secondary bg-transparent border-0">
                    <FaEnvelope />
                    </span>
                    <input 
                    type="text" 
                    className="form-control bg-transparent border-0" 
                    placeholder="Username or Email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{
                        height: "50px",
                    }}
                    />
                </div>
              </div>

              <div className="mb-3">
                <div className="input-group text-secondary bg-white rounded-pill px-3" 
                    style={{ border: "2px solid #dee2e6" }}>
                    <span className="input-group-text text-secondary bg-transparent border-0">
                    <FaLock />
                    </span>
                    <input 
                    type="password" 
                    className="form-control bg-transparent border-0" 
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{
                        height: "50px",
                    }}
                    />
                </div>
              </div>
             
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 mb-3 rounded-pill"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <div className="d-flex align-items-center mb-3">
                <div className="flex-grow-1 border-bottom"></div>
                <span className="mx-3 text-muted">or</span>
                <div className="flex-grow-1 border-bottom"></div>
              </div>
              
              <button 
                type="button" 
                className="btn btn-outline-secondary w-100 py-2 mb-3 rounded-pill"
                onClick={handleGoogleSignIn}
              >
                <span className="bi bi-google me-2"></span>
                Sign in with Google
              </button>
              
              <p className="text-center mb-0">
                Don&apos;t have an account? <button className="btn btn-link text-decoration-none p-0" onClick={() => navigate('/register')}>Register</button>
              </p>
            </form>
          </div>
        </div>
     
   
  );
};

export default Login;