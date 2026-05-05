import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatUser: null,
    messages: [],
  },
  reducers: {
    setChatUser: (state, action) => {
      state.chatUser = action.payload || null;
    },

    // ✅ FIXED (supports functional update for socket real-time)
    setMessage: (state, action) => {
      if (typeof action.payload === "function") {
        state.messages = action.payload(state.messages);
      } else {
        state.messages = action.payload || [];
      }
    },

    // ✅ keep as it is (already correct)
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearChat: (state) => {
      state.chatUser = null;
      state.messages = [];
    },
  },
});

export const {
  setChatUser,
  setMessage,
  addMessage,
  clearChat
} = chatSlice.actions;

export default chatSlice.reducer;