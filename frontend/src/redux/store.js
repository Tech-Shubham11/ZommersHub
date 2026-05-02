import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authslice.js";
import postSlice from "./postslice.js";
import socketSlice from "./socketSlice.js";
import chatSlice from "./chatSlice.js";
import rtnSlice from "./rtnSlice.js";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// 🔥 Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "post", "chat"], 
  // ❌ DO NOT persist socketio
};

// 🔥 Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice, // not persisted
  chat: chatSlice,
  realTimeNotification : rtnSlice
});

// 🔥 Wrap reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔥 Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 🔥 Persistor
export const persistor = persistStore(store);

