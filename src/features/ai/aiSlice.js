import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===========================
// SEND MESSAGE TO AI
// ===========================
export const sendMessageToAI = createAsyncThunk(
  "ai/sendMessage",
  async ({ message, history }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        "/api/v1/ai/chat",
        { message, history },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "AI хариу үүсгэх боломжгүй байна." }
      );
    }
  }
);

// ===========================
// INITIAL STATE
// ===========================
const initialState = {
  messages: [
    {
      role: "assistant",
      content:
        "Сайн байна уу? 👋 Би ShopEasy-ийн AI туслах. Та бүтээгдэхүүн хайх, захиалга хийх, хүргэлт, төлбөрийн талаар асууж болно.",
    },
  ],
  loading: false,
  error: null,
};

// ===========================
// SLICE
// ===========================
const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearChat: (state) => {
      state.messages = [
        {
          role: "assistant",
          content:
            "Сайн байна уу? 👋 Би ShopEasy-ийн AI туслах. Та бүтээгдэхүүн хайх, захиалга хийх, хүргэлт, төлбөрийн талаар асууж болно.",
        },
      ];
      state.error = null;
    },
    removeAIError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.messages.push({
          role: "assistant",
          content: action.payload.message,
        });
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "AI алдаа гарлаа";
        state.messages.push({
          role: "assistant",
          content:
            "Уучлаарай, хариу үүсгэх боломжгүй байна. Дахин оролдоно уу.",
        });
      });
  },
});

export const { clearChat, removeAIError } = aiSlice.actions;
export default aiSlice.reducer;