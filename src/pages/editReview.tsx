import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Import RootState type
import Header from '../components/header';
import './editReview.css'; // Create a CSS file for styles

const EditReview: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the book ID from the route parameter
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const token = useSelector((state: RootState) => state.auth.token); // Get token from Redux store
  const navigate = useNavigate(); // Use for navigation after actions

  // Fetch book review details to pre-fill form
  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);

        // Fetch book details by ID
        const response = await fetch(`https://railway.bookreview.techtrain.dev/books/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include Bearer token in request headers
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();

        if (data && data.id) {
          // Set the form fields with fetched data
          setTitle(data.title);
          setUrl(data.url);
          setDetail(data.detail);
          setReview(data.review);
        } else {
          throw new Error('No book found');
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Error fetching book details');
        setLoading(false);
      }
    };

    fetchBookDetail();

  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://railway.bookreview.techtrain.dev/books/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, url, detail, review }),
      });

      if (!response.ok) {
        throw new Error('Failed to update book details');
      }

      // On successful update, navigate back to the home page
      navigate(`/`);
    } catch (error) {
      console.error(error);
      setError('Error updating book details');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://railway.bookreview.techtrain.dev/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the book review');
      }

      // On successful delete, navigate back to the home page
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Error deleting book review');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="edit-review-container">
        <h1>Edit Review</h1>
        <form className="edit-review-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Detail</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Update Review</button>
        </form>
        <button onClick={handleDelete} className="delete-button">Delete Review</button>
      </div>
    </div>
  );
};

export default EditReview;
