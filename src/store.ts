import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import paginationReducer from "./slices/paginationSlice"; // Import the pagination slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pagination: paginationReducer, // Add pagination reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;