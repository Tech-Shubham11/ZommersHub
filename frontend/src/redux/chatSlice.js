import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatUser: null,   // ✅ should be object or null
    messages: [],
  },
  reducers: {
    setChatUser: (state, action) => {
      state.chatUser = action.payload || null;
    },

    setMessage: (state, action) => {
      state.messages = action.payload || [];
    },

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
