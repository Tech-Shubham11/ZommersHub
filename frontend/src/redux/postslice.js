import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload || [];
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload || null;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
});

export const {
  setPosts,
  setSelectedPost,
  clearSelectedPost,
} = postSlice.actions;

export default postSlice.reducer;
