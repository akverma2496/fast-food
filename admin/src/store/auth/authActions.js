import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(AUTH_URL, {
        email,
        password,
        returnSecureToken: true,
      });

      const { idToken, refreshToken, localId } = res.data;

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { idToken, refreshToken, userId: localId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error?.message || "Login failed");
    }
  }
);
