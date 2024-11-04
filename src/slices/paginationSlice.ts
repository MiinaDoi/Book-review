import { createSlice } from "@reduxjs/toolkit";

interface PaginationState {
  offset: number;
}

const initialState: PaginationState = {
  offset: 0, // Start with the first page (offset = 0)
};

const authSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setNextPage: (state) => {
      state.offset += 10; // Increment offset by 10 for the next page
    },
    setPrevPage: (state) => {
      state.offset = Math.max(0, state.offset - 10); // Decrement offset for the previous page (not below 0)
    },
  },
});

export const { setNextPage, setPrevPage } = authSlice.actions;
export default authSlice.reducer;