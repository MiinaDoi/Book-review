import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setNextPage, setPrevPage } from "../slices/paginationSlice";

import './pagination.css';

const PaginationControls: React.FC = () => {
  const offset = useSelector((state: RootState) => state.pagination.offset);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="pagination-container">
      {!(offset === 0) ? (
        <button
          onClick={() => dispatch(setPrevPage())}
          className="pagination-button"
        >
          Previous
        </button>
      ) : (
        <div></div> // Empty div to maintain space when "Previous" is hidden
      )}
      <button
        onClick={() => dispatch(setNextPage())}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
