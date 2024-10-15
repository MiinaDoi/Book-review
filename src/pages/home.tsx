import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom"; // Import for navigation

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import Font Awesome
import { faEdit } from "@fortawesome/free-solid-svg-icons"; // Import specific icon

import PaginationControls from "./pagination";
import Header from "../components/header";

import './home.css'

interface BookReview {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
  isMine: boolean | null;
}

const Home = () => {
  const offset = useSelector((state: RootState) => state.pagination.offset);
  const [bookReviews, setBookReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate(); // Navigation function

  useEffect(() => {
    const fetchBookReviews = async () => {
      setLoading(true);
      try {
        const apiUrl = token
          ? `https://railway.bookreview.techtrain.dev/books?offset=${offset}`
          : `https://railway.bookreview.techtrain.dev/public/books?offset=${offset}`;

        const response = await fetch(apiUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined, // Pass Bearer token if logged in
        });

        if (!response.ok) {
          throw new Error("Failed to fetch book reviews");
        }

        const data = await response.json();
        setBookReviews(data); // Update to handle full data array without slicing in client
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch book reviews:", error);
        setLoading(false);
      }
    };

    fetchBookReviews();
  }, [offset, token]); // Re-run when offset or token changes

  const truncateText = (text: string, limit: number) => {
    if (text.length > limit) {
      return text.substring(0, limit) + '...';
    }
    return text;
  };

  const handleDetailClick = (id: string) => {
    // Log the book selection
    console.log(`Navigating to detail page for book ID: ${id}`);

    // Navigate to the book detail page
    navigate(`/detail/${id}`); 
  };

  const handleEditClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the parent div's click event
    navigate(`/edit/${id}`);
  };

  const handleCreateReview = () => {
    navigate('/new'); // Navigate to the review creation page
  };

  return (
    <div>
      <div className="container">
      <Header />
        <div>
          <div className="heading-container">
            <button className="create-review-button" onClick={handleCreateReview}>
              Create Review
            </button>
            <h1>Review Overview</h1>
          </div>
          <div className="review-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid-container">
              {bookReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="review-box"
                  onClick={() => handleDetailClick(review.id)} 
                >
                  <h2>{truncateText(review.title, 10)}</h2>
                  <p>{truncateText(review.detail, 10)}</p> 
                  <p className="reviewer">Review by: {review.reviewer}</p>
                  <div className="navigate-container">
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read More
                  </a>
                  {review.isMine && (
                  <button 
                    onClick={(e) => handleEditClick(review.id, e)} 
                    className="edit-icon"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  )}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
          <div className="pagination-container">
            <PaginationControls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
