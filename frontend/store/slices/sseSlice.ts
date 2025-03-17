import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  text: string;
  isBot: boolean;
}
interface SSEState {
  messages: Record<string, Message[]>;
  loading: boolean;
  canSendMessage: boolean;
  sessionId: string | undefined;
}

const initialState: SSEState = {
  messages: {},
  loading: false,
  canSendMessage: true,
  sessionId: undefined,
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
      if (state.sessionId === undefined) {
        state.sessionId = new Date().toLocaleString();
      }
      // let currentChat = state.messages[state.sessionId];
      if (!state.messages[state.sessionId]) {
        state.messages[state.sessionId] = [];
      }

      if (state.messages[state.sessionId].length === 0) {
        state.messages[state.sessionId].push(action.payload);
        return;
      } else if (action.payload.isBot) {
        const lastMessage = state.messages[state.sessionId][state.messages[state.sessionId].length - 1];
        if (lastMessage.isBot === action.payload.isBot) {
          state.messages[state.sessionId][state.messages[state.sessionId].length - 1].text += action.payload.text;
          return;
        } else {
          state.messages[state.sessionId].push(action.payload);
        }
      } else {
        state.messages[state.sessionId].push(action.payload);
      }
    },
    setCanSendMessage: (state, value: PayloadAction<boolean>) => {
      state.canSendMessage = value.payload
    },
    setSessionId: (state, value: PayloadAction<string>) => {
      state.sessionId = value.payload
    }
  },
});

export const { startLoading, stopLoading, addMessage, setCanSendMessage, setSessionId } = sseSlice.actions;
export default sseSlice.reducer;