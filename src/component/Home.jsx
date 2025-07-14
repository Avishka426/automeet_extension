import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      // Call the server-side logout endpoint
      const response = await fetch('http://localhost:8080/api/auth/logout', {
        method: 'GET',
        credentials: 'include', // Important to include cookies
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('user');
        
        // Clear any token refresh intervals
        if (window.refreshTokenInterval) {
          clearInterval(window.refreshTokenInterval);
        }
        
        // Redirect to login page after successful logout
        navigate('/login');
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if server logout fails, clear local data and redirect
      localStorage.removeItem('user');
      if (window.refreshTokenInterval) {
        clearInterval(window.refreshTokenInterval);
      }
      navigate('/login');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with logout button */}
      <div style={styles.header}>
        <h1 style={styles.heading}>Schedule a Meeting</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
      
      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/direct')} style={styles.button}>
            Direct Meeting
          </button>
          <button onClick={() => navigate('/group')} style={styles.button}>
            Group Meeting
          </button>
          <button onClick={() => navigate('/roundrobin')} style={styles.button}>
            Round Robin Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
   
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f8fa',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: '1.5rem',
    margin: 0,
    color: '#333',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '300px',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
  }
}

export default Home