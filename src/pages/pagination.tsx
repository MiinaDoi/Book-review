import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setNextPage, setPrevPage } from "../slices/paginationSlice";

const PaginationControls: React.FC = () => {
  const offset = useSelector((state: RootState) => state.pagination.offset);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex justify-between w-full">
      {!(offset === 0) ? (
        <button
          onClick={() => dispatch(setPrevPage())}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
        >
          Previous
        </button>
      ) : (
        <div></div> // Empty div to maintain space when "Previous" is hidden
      )}
      <button
        onClick={() => dispatch(setNextPage())}
        className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
