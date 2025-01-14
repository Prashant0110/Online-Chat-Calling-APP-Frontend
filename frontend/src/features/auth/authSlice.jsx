import { createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService"; // Assuming your authService is in the services folder

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create authSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action for login request
    loginRequest: (state) => {
      state.loading = true;
    },
    // Action for login success
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Action for login failure
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Action for logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    // Action for register request
    registerRequest: (state) => {
      state.loading = true;
    },
    // Action for register success
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Action for register failure
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
} = authSlice.actions;

// Thunks for handling async login and register operations

// Login user
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const userData = await authService.login(credentials);
    dispatch(loginSuccess(userData));
  } catch (error) {
    dispatch(loginFailure(error.message || "Login failed"));
  }
};

// Register user
export const registerUser = (details) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const userData = await authService.register(details);
    dispatch(registerSuccess(userData));
  } catch (error) {
    dispatch(registerFailure(error.message || "Registration failed"));
  }
};

export default authSlice.reducer;
