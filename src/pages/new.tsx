import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Import RootState type
import Header from '../components/header';
import './new.css';

const NewReview: React.FC = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [detail, setDetail] = useState('');
  const [review, setReview] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      title,
      url,
      detail,
      review,
    };

    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Adding Bearer token to the request headers
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setSuccess('Review submitted successfully');
        navigate('/');  // Redirect to the home page upon successful submission
      } else {
        setError('Failed to submit the review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error submitting review');
    }
  };

  return (
    <div>
      <Header />
      <h1>Create Review</h1>
    <div className="new-review-container">
      <form className="new-review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">Source</label>
          <input
            type="text"
            id="url"
            placeholder="Feel Free to type a book url here!"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="detail">Detail</label>
          <textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
    </div>
  );
};

export default NewReview;
