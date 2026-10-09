import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===========================
// REGISTER
// ===========================
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await axios.post("/api/v1/register", userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed. Please try again later." }
      );
    }
  }
);

// ===========================
// LOGIN
// ===========================
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/v1/login",
        { email, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed. Please try again later." }
      );
    }
  }
);

// ===========================
// GOOGLE LOGIN
// ===========================
export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/v1/auth/google",
        { credential },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Google login failed." });
    }
  }
);

// ===========================
// LOAD USER
// ===========================
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/profile");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to load user profile." }
      );
    }
  }
);

// ===========================
// LOGOUT
// ===========================
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/logout");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Logout failed." });
    }
  }
);

// ===========================
// UPDATE PROFILE
// ===========================
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await axios.put(
        "/api/v1/profile/update",
        userData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Profile update failed. Please try again later.",
        }
      );
    }
  }
);

// ===========================
// UPDATE PASSWORD
// ===========================
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.put(
        "/api/v1/password/update",
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Password update failed." });
    }
  }
);

// ===========================
// FORGOT PASSWORD
// ===========================
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/v1/password/forgot",
        { email },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Email sent failed." }
      );
    }
  }
);

// ===========================
// RESET PASSWORD
// ===========================
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `/api/v1/reset/${token}`,
        userData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Password reset failed." }
      );
    }
  }
);

// ===========================
// INITIAL STATE
// ===========================
const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
  error: null,
  success: false,
  // isAuthenticated-ийг boolean утгаар шууд хадгална
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  message: null,
};

// ===========================
// SLICE
// ===========================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.success = false;
      state.message = null;
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },
  },
  extraReducers: (builder) => {
    // ========== REGISTER ==========
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || false;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", state.isAuthenticated);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Registration failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
      });

    // ========== LOGIN ==========
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || false;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", state.isAuthenticated);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Login failed. Please try again later.";
        state.user = null;
        state.isAuthenticated = false;
      });

    // ========== GOOGLE LOGIN ==========
    builder
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || false;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", state.isAuthenticated);
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Google login failed.";
        state.user = null;
        state.isAuthenticated = false;
      });

    // ========== LOAD USER ==========
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated", state.isAuthenticated);
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load user profile.";
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      });

    // ========== LOGOUT ==========
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
        
        // АНХААР: Энд success-ийг false болгож байна. 
        // Ингэснээр "Амжилттай нэвтэрлээ" гэж гарахгүй.
        state.success = false; 
        state.message = action.payload?.message || "Амжилттай гарлаа";
        
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed.";
      });

    // ========== UPDATE PROFILE ==========
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || false;
        state.message = action.payload?.message || "Profile updated";

        if (action.payload?.user) {
          state.user = { ...action.payload.user };
        }

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Profile update failed.";
      });

    // ========== UPDATE PASSWORD ==========
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || false;
        state.message =
          action.payload?.message || "Password updated successfully";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password update failed.";
      });

    // ========== FORGOT PASSWORD ==========
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || false;
        state.message = action.payload?.message || "Email sent successfully";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Email sending failed.";
      });

    // ========== RESET PASSWORD ==========
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || false;
        state.message =
          action.payload?.message || "Password reset successfully";
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password reset failed.";
      });
  },
});

export const { removeErrors, removeSuccess, clearUser } = userSlice.actions;
export default userSlice.reducer;