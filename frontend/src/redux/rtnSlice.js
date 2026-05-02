import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      const payload = action.payload;

      if (payload.type === "like") {
        // add newest on top
        state.likeNotification.unshift(payload);
      }

      if (payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) =>
            !(
              item.userId === payload.userId &&
              item.postId === payload.postId
            )
        );
      }
    },

    clearNotifications: (state) => {
      state.likeNotification = [];
    },
  },
});

export const { setLikeNotification, clearNotifications } =
  rtnSlice.actions;

export default rtnSlice.reducer;