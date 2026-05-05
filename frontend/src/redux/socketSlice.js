import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio",
  initialState: {
    socket: null,

    // ✅ NEW (for message notification badge)
    unreadMessages: 0,

    // ✅ NEW (track online users)
    onlineUsers: [],
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload || null;
    },

    clearSocket: (state) => {
      state.socket = null;
    },

    // ✅ INCREMENT when new message comes
    incrementNotification: (state) => {
      state.unreadMessages += 1;
    },

    // ✅ RESET when user opens chat
    clearNotification: (state) => {
      state.unreadMessages = 0;
    },

    // ✅ store online users (optional but useful)
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload || [];
    },
  },
});

export const {
  setSocket,
  clearSocket,
  incrementNotification,
  clearNotification,
  setOnlineUsers
} = socketSlice.actions;

export default socketSlice.reducer;
