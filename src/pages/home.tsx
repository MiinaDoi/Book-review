import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import PaginationControls from "./pagination";

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

  useEffect(() => {
    const fetchBookReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://railway.bookreview.techtrain.dev/public/books?offset=${offset}`
        );
        const data = await response.json();
        setBookReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch book reviews:", error);
        setLoading(false);
      }
    };

    fetchBookReviews();
  }, [offset]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-screen-lg mx-auto py-8">
        <h1 className="text-2xl font-bold text-center mb-6">Book Review</h1>
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
                href={review.url} // future version of react will not support here.
                className="text-blue-500 hover:text-blue-700 text-left mt-auto"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More
              </a>
            </div>
          ))}
        </div>
        <div className="relative w-full mt-8">
          <PaginationControls/>
        </div>
      </div>
    </div>
  );
};

export default Home;
