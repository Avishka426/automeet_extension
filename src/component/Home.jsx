import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Schedule a Meeting</h1>
      <div style={styles.buttonGroup}>
        <button onClick={() => navigate('/direct')} style={styles.button}>Direct Meeting</button>
        <button onClick={() => navigate('/group')} style={styles.button}>Group Meeting</button>
        <button onClick={() => navigate('/roundrobin')} style={styles.button}>Round Robin Meeting</button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f5f8fa',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
  }
}

export default Home
