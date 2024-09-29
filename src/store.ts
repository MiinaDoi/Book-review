import { configureStore } from "@reduxjs/toolkit";
import paginationReducer from "./slices/authSlice"; // Import the pagination slice

export const store = configureStore({
  reducer: {
    pagination: paginationReducer, // Add pagination reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;