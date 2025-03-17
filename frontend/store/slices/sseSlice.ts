import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SSEState {
  messages: string[]; // Array to store all chunks of data
  loading: boolean;
}

const initialState: SSEState = {
  messages: [],
  loading: false,
};

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    addMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload); // Append the new message chunk to the array
    },
  },
});

export const { startLoading, stopLoading, addMessage } = sseSlice.actions;
export default sseSlice.reducer;