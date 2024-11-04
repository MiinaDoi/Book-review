import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../slices/authSlice';

import './login.css';

interface LoginResponse {
  token: string;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    let newErrors = { email: '', password: '' };
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.email = 'Email address should include @';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('https://railway.bookreview.techtrain.dev/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const data = (await response.json()) as LoginResponse;
        if (response.ok) {
          console.log('Login successful:', data);
          dispatch(setToken(data.token));
          navigate('/');
        } else {
          setErrors((prev) => ({ ...prev, email: 'Login failed', password: 'Login failed' }));
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors((prev) => ({ ...prev, email: 'Login error', password: 'Login error' }));
      }
    } else {
      console.log('Form is invalid');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} noValidate>
        <h2>Welcome Back!</h2>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <button type="submit" className="button">Log in</button>
        <Link to="/signup" className="signup-redirect">Create new account.</Link>
      </form>
    </div>
  );
}

export default Login;
