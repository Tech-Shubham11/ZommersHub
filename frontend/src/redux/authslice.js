import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestedUsers: [],
  userProfile: null, // single profile data
  selectedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload || null;
    },

    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload || [];
    },

  setUserProfile: (state, action) => {
  state.userProfile = action.payload;
},

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload || null;
    },

    // 🔥 Very Important for logout
    logout: (state) => {
      state.user = null;
      state.suggestedUsers = [];
      state.userProfile = null;
      state.selectedUser = null;
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
