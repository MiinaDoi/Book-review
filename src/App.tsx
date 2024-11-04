import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/login';  // Import the Login component
import Signup from './pages/signup';
import Upload from './pages/upload';
import Home from './pages/home';
import Profile from './pages/profile'; // Import the profile componen
import NewReview from './pages/new';
import Detail from './pages/detail';
import EditReview from './pages/editReview';

import { useSelector } from 'react-redux'; // Redux for auth state
import { RootState } from './store'; // RootState for your Redux store

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token); // Access the Bearer token from Redux state

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/" replace /> : <Signup />} />

        {/* Conditional rendering based on authentication status */}
        {token ? (
          <>
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new" element={<NewReview />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/edit/:id" element={<EditReview />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Fallback route for unknown paths */}
      </Routes>
    </Router>
  );
};

export default App;