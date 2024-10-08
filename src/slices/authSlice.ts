import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";

// Set up cookies
const cookies = new Cookies();

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  token: cookies.get('token') || null,  // Get the token from cookies if it exists
  isLoggedIn: !!cookies.get('token'),   // Check if token exists to set logged-in state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set the token after successful login
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      // Save token to cookies
      cookies.set('token', action.payload, { path: '/', maxAge: 3600 }); // Save token with 1 hour expiration
    },
    // Clear the token (for logout)
    clearToken: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      // Remove token from cookies
      cookies.remove('token', { path: '/' });
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;