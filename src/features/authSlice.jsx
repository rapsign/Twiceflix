import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, provider, signInWithPopup, signOut } from "../firebase/firebase";

// Async thunk to handle login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to handle logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Store only user ID or email, not the entire user object
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = {
          uid: action.payload.uid,
          email: action.payload.email,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
