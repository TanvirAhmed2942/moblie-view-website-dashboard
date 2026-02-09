import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import your slices here
import { baseApi } from "@/utils/apiBaseQuery";
import { api } from "../getBaseApi";
import authSlice from "../slices/authSlice";
import campaignFormSlice from "../slices/campaignFormSlice";
import nextGenSlice from "../slices/nextGenSlice";
import notificationSlice from "../slices/notificationSlice";
import readinessExamSlice from "../slices/readinessExamSlice";
import standAloneExamSlice from "../slices/standAloneExamSlice";
import studySlice from "../slices/studySlice";
import usersSlice from "../slices/usersSlice";

// Root reducer
const rootReducer = combineReducers({
  // Add your reducers here
  auth: authSlice,
  [api.reducerPath]: api.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  users: usersSlice,
  study: studySlice,
  nextGen: nextGenSlice,
  standAlone: standAloneExamSlice,
  readiness: readinessExamSlice,
  notifications: notificationSlice,
  campaignForm: campaignFormSlice,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "users",
    "study",
    "nextGen",
    "standAlone",
    "readiness",
    "notifications",
    "campaignForm",
  ], // Persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
        ],
      },
    }).concat(api.middleware, baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
