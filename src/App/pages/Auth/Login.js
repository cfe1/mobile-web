import { API, ENDPOINTS } from 'api/apiService';
import { Toast } from 'App/components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { loginSuccess } from 'redux/actions/authActions';
import { AGALIA_ID, API_TOKEN } from 'storage/StorageKeys';
import StorageManager from 'storage/StorageManager';

const Login = () => {
  const [masterPin, setMasterPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  
  const handleMasterPinChange = (e) => {
    const input = e.target.value;
    
    // Only allow digits and maximum 6 characters
    if (/^\d{0,6}$/.test(input)) {
      setMasterPin(input);
      setPinError('');
    } else if (!/^\d*$/.test(input)) {
      setPinError('Master PIN must contain only digits');
    } else if (input.length > 6) {
      setPinError('Master PIN must be exactly 6 digits');
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const validateForm = () => {
    if (masterPin.length !== 6) {
      setPinError('Master PIN must be exactly 6 digits');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const payload = {
        master_pin: masterPin,
      };
      
      const resp = await API.post(ENDPOINTS.LOGIN, payload, false);
      
      if (resp.success && resp.data) {
        console.log('Login successful', resp.data);
        
        const { role, token, profile } = resp.data || {};
        StorageManager.put(API_TOKEN, token);
        StorageManager.put(AGALIA_ID, profile?.id);
        
        dispatch(loginSuccess({
          profile: profile,
          token: token,
        }));
        
        // Redirect to dashboard
        history.replace('/dashboard');
      }
    } catch (e) {
      // Show error toast if login fails
      console.log(e);
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
    },
    errorText: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '4px',
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
    },
    disabledButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#f8a0c2',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'not-allowed',
    },
    linkContainer: {
      marginTop: '16px',
      textAlign: 'center',
    },
    link: {
      fontSize: '14px',
      color: '#F03E88',
      textDecoration: 'none',
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
          <label style={styles.label}>Enter Master Pin (6 digits)</label>
          <input
            type="tel"
            value={masterPin}
            onChange={handleMasterPinChange}
            style={styles.input}
            maxLength={6}
            placeholder="Enter 6-digit PIN"
          />
          {pinError && <p style={styles.errorText}>{pinError}</p>}
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
          style={masterPin.length === 6 ? styles.button : styles.disabledButton} 
          onClick={handleLogin}
          disabled={loading || masterPin.length !== 6}
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