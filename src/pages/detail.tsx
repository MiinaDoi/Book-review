import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Import RootState type
import Header from '../components/header';

import './detail.css'; // Create a CSS file for styles

interface BookDetail {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean | null;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the book ID from the route parameter
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token); // Assume user is logged in and has token

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
          setBook(data); // Set the book data
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

    fetchBookDetail(); // Directly call fetchBookDetail without token check

  }, [id, token]); // Dependency array includes 'id' and 'token'

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

  if (!book) {
    return (
      <div>
        <Header />
        <p>Book not found</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="detail-container">
        <h1>{book.title}</h1>
        <p><strong>Review by:</strong> {book.reviewer}</p>
        <p><strong>Detail:</strong> {book.detail}</p>
        <p><strong>Review:</strong> {book.review}</p>
        {book.isMine && <p>This is your review.</p>}
        <a href={book.url} target="_blank" rel="noopener noreferrer">
          Check Book
        </a>
      </div>
    </div>
  );
};

export default Detail;
