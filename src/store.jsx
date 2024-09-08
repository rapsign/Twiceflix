import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/loginUser/fulfilled"],
        ignoredPaths: ["auth.user"],
      },
    }),
});

export default store;
