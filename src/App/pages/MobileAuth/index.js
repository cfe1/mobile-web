import { API, ENDPOINTS } from 'api/apiService';
import { Toast } from 'App/components';
import React, { useState } from 'react';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      
      const payload = {
        master_pin: '302530',
     //   mobile: phoneNumber,
      //  country_code: "+1"
      };
      
      const resp = await API.post(ENDPOINTS.LOGIN, payload);
      
      if (resp.success && resp.data) {
        // Handle successful login
        // For example, redirect to dashboard or store auth token
        console.log('Login successful', resp.data);
        
        // You might want to store authentication data
        // localStorage.setItem('auth_token', resp.data.token);
        
        // Redirect user to dashboard or home page
        // window.location.href = '/dashboard';
      }
    } catch (e) {
      // Show error toast if login fails
      Toast.showErrorToast(e.data?.error?.message[0] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // CSS styles
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '24px',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
    logoText: {
      marginLeft: '8px',
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
    },
    subtitle: {
      fontSize: '18px',
      color: '#4b5563',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#4b5563',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      outline: 'none',
      fontSize: '16px',
      transition: 'all 0.2s',
      '&:focus': {
        borderColor: '#F03E88',
        boxShadow: '0 0 0 2px rgba(240, 62, 136, 0.2)',
      },
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      borderColor: '#d1d5db',
      borderRadius: '4px',
      accentColor: '#F03E88',
    },
    checkboxLabel: {
      marginLeft: '8px',
      fontSize: '14px',
      color: '#4b5563',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#F03E88',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#e02d77',
      },
      '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(240, 62, 136, 0.3)',
      },
      '&:disabled': {
        backgroundColor: '#f8a0c2',
        cursor: 'not-allowed',
      },
    },
    linkContainer: {
      marginTop: '16px',
      textAlign: 'center',
    },
    link: {
      fontSize: '14px',
      color: '#F03E88',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    signUpContainer: {
      marginTop: '24px',
      textAlign: 'center',
    },
    signUpText: {
      fontSize: '14px',
      color: '#4b5563',
    },
    signUpLink: {
      fontSize: '14px',
      color: '#F03E88',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="#F03E88" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span style={styles.logoText}>Agalia</span>
          </div>
          <p style={styles.subtitle}>See your shifts, schedules & payments</p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            style={styles.input}
          />
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={handleRememberMeChange}
            style={styles.checkbox}
          />
          <label htmlFor="remember-me" style={styles.checkboxLabel}>
            Remember me
          </label>
        </div>

        <button 
          style={styles.button} 
          onClick={handleLogin}
         // disabled={loading || !phoneNumber}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={styles.linkContainer}>
          <a href="#" style={styles.link}>
            Unable To Login
          </a>
        </div>

        <div style={styles.signUpContainer}>
          <span style={styles.signUpText}>Not yet Agalia Business? </span>
          <a href="#" style={styles.signUpLink}>
            Sign up now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;