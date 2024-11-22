import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Corrected the typo here
      // Only store serializable parts of the user
      const { uid, email, displayName } = action.payload || {};
      state.user = {
        uid,
        email,
        displayName,
      };
      state.isAuthenticated = true; // Add isAuthenticated flag to true when user is set
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false; // Add isAuthenticated flag to false when user is cleared
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export default authSlice.reducer;
