import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get Wishlist
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/wishlist");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Алдаа гарлаа");
    }
  }
);

// Add to Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { rejectWithValue }) => {
    try {
      const productId = typeof product === "string" ? product : product._id;
      const { data } = await axios.post("/api/v1/wishlist", { productId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Алдаа гарлаа");
    }
  }
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const id = typeof productId === "string" ? productId : productId._id;
      const { data } = await axios.delete(`/api/v1/wishlist/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Алдаа гарлаа");
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    // Optimistic update - UI-д шууд нэмэх
    optimisticAdd: (state, action) => {
      const product = action.payload;
      if (product && product._id) {
        const exists = state.products.some((p) => p._id === product._id);
        if (!exists) {
          state.products.push(product);
        }
      }
    },
    // Optimistic update - UI-аас шууд устгах
    optimisticRemove: (state, action) => {
      const productId = action.payload;
      const id = typeof productId === "string" ? productId : productId._id;
      state.products = state.products.filter((p) => p._id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || [];
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      });

    builder
      .addCase(addToWishlist.pending, (state) => {
        // Loading-ийг true болгохгүй (optimistic update-д UI блоклохгүй)
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.products = action.payload?.wishlist?.products || state.products;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.products = action.payload?.wishlist?.products || state.products;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { removeErrors, optimisticAdd, optimisticRemove } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;