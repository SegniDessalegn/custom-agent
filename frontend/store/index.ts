import { configureStore } from '@reduxjs/toolkit';
import sseReducer from './slices/sseSlice';

export const store = configureStore({
  reducer: {
    sse: sseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;