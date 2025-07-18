import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
     
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
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brandSection}>
          <h1 style={styles.brandName}>AutoMeet</h1>
          <p style={styles.tagline}>Chrome Extension</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}
        onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.backgroundColor = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
          Log out
        </button>
        
      </div>
      <hr style={styles.customHr} />





      {/* Meeting Options */}
      <div style={styles.content}>
        <div style={styles.sectionTitle}>
          <h3 style={styles.sectionHeading}>Choose Your Meeting Type</h3>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            onClick={() => navigate('/direct')} 
            style={styles.meetingButton}
            onMouseEnter={(e) => {
              
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(90, 103, 216, 0.3)';
            }}
            onMouseLeave={(e) => {
              
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={styles.buttonContent}>
              <div style={styles.buttonTitle}>Direct Meeting</div>
              <div style={styles.buttonDescription}>Schedule one-on-one meetings</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/group')} 
            style={styles.meetingButton}
            onMouseEnter={(e) => {
            
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(90, 103, 216, 0.3)';
            }}
            onMouseLeave={(e) => {
              
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={styles.buttonContent}>
              <div style={styles.buttonTitle}>Group Meeting</div>
              <div style={styles.buttonDescription}>Coordinate with multiple participants</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/roundrobin')} 
            style={styles.meetingButton}
            onMouseEnter={(e) => {
            
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(90, 103, 216, 0.3)';
            }}
            onMouseLeave={(e) => {
            
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <div style={styles.buttonContent}>
              <div style={styles.buttonTitle}>Round Robin Meeting</div>
              <div style={styles.buttonDescription}>Set up rotating schedules</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          One platform to schedule, analyze, and run meetings better.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '500px',
    minHeight: 'auto',
    
    display: 'flex',
    flexDirection: 'column',
    
    backgroundColor: '#f5f8fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  customHr: {
    width: '100%',
    marginBottom: '0.5rem',
    border: 'none',
    borderTop: '2px solid #ccc', /* You can customize this */
},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem 0 1.5rem',
   
    backgroundColor: '#f5f8fa',
  },
  
  brandSection: {
    flex: 1,
  },
  
  brandName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 0.2rem 0',
    color: '#3B3BD7',
    letterSpacing: '-0.025em',
  },
  
  tagline: {
    fontSize: '0.8rem',
    margin: 0,
    color: '#1b1b1c',
    fontWeight: '500',
  },
  
  logoutButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
  },
  
  content: {
    flex: 1,
    padding: '2rem 1.5rem',
    backgroundImage: 'url("/background.png")',
    backgroundColor: '#f5f8fa',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  
  sectionTitle: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  
  sectionHeading: {
    fontSize: '1.375rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
    letterSpacing: '-0.025em',
  },
  
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%',
  },
  
  meetingButton: {
    padding: '1.25rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#3B3BD7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    textAlign: 'left',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  
  buttonContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  buttonTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
    letterSpacing: '-0.025em',
  },
  
  buttonDescription: {
    fontSize: '0.875rem',
    opacity: 0.9,
    fontWeight: '400',
    lineHeight: '1.4',
  },
  
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },
  
  footerText: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#64748b',
    margin: 0,
    fontWeight: '500',
    letterSpacing: '-0.025em',
  },
};

export default Home;