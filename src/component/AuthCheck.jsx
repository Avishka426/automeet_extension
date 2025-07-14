import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/status', {
          credentials: 'include'
        });
                
        if (response.ok) {
          // If authenticated, redirect to home
          navigate('/home');
        } else {
          // If not authenticated, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On error, redirect to login
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading state while checking auth
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default AuthCheck;