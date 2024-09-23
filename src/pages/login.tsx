import React, { useState } from 'react';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    let newErrors = { email: '', password: '' };
    if (!email.includes('@')) {
      newErrors.email = 'Email address should include @';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);

    // Return true if no errors
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      console.log('Form is valid');
      // Proceed with further logic like API call
    } else {
      console.log('Form is invalid');
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      <button onClick={handleSubmit}>Login</button>
    </form>
  );
}

export default Login;
