import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  text: string;
  isBot: boolean;
}
interface SSEState {
  messages: Message[]; // Array to store all chunks of data
  loading: boolean;
  canSendMessage: boolean;
}

const initialState: SSEState = {
  messages: [],
  loading: false,
  canSendMessage: true,
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
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.messages.length === 0) {
        state.messages.push(action.payload);
        return;
      } else if (action.payload.isBot) {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage.isBot === action.payload.isBot) {
          state.messages[state.messages.length - 1].text += action.payload.text;
          return;
        } else {
          state.messages.push(action.payload);
        }
      } else {
        state.messages.push(action.payload);
      }
    },
    setCanSendMessage: (state, value: PayloadAction<boolean>) => {
      state.canSendMessage = value.payload
    }
  },
});

export const { startLoading, stopLoading, addMessage, setCanSendMessage } = sseSlice.actions;
export default sseSlice.reducer;