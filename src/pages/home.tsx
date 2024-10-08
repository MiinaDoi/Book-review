import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useCookies } from "react-cookie"; // Import for cookie handling

import PaginationControls from "./pagination";
import Header from "../components/header";

interface BookReview {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
}

const Home = () => {
  const offset = useSelector((state: RootState) => state.pagination.offset);
  const [bookReviews, setBookReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cookies] = useCookies(["token"]); // Access the token from cookies
  const token = cookies.token; // Token retrieved from cookies

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

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-screen-lg mx-auto py-8">
        <h1 className="text-2xl font-bold text-center mb-6">Book Review</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {bookReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-100 p-4 rounded-lg shadow flex flex-col space-y-2"
              >
                <h2 className="font-semibold text-left">{review.title}</h2>
                <p className="text-sm text-left">{review.detail}</p>
                <p className="text-xs text-left">Review by: {review.reviewer}</p>
                <a
                  href={review.url}
                  className="text-blue-500 hover:text-blue-700 text-left mt-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        )}
        <div className="relative w-full mt-8">
          <PaginationControls />
        </div>
      </div>
    </div>
  );
};

export default Home;
