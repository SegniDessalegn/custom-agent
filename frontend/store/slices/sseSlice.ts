import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  text: string;
  isBot: boolean;
  tool_name?: string | undefined;
  tool_output?: string | undefined;
}
interface SSEState {
  messages: Record<string, Message[]>;
  loading: boolean;
  sessionId: string | undefined;
}

const initialState: SSEState = {
  messages: {},
  loading: false,
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
      if (!state.messages[state.sessionId]) {
        state.messages[state.sessionId] = [];
      }
      
      if (action.payload.isBot) {
        const length = state.messages[state.sessionId].length;
        if (length === 0 || !state.messages[state.sessionId][length - 1].isBot) {
          state.messages[state.sessionId].push(action.payload);
          return;
        } else {
          if (action.payload.tool_name !== undefined) {
            state.messages[state.sessionId].push(action.payload);
            return;
          }
          const lastMessage = state.messages[state.sessionId][length - 1];
          if (lastMessage.tool_name !== undefined) {
            state.messages[state.sessionId].push(action.payload);
            return
          } else {
            state.messages[state.sessionId][length - 1].text += action.payload.text;
          }
          return;
        }
      } else {
        state.messages[state.sessionId].push(action.payload);
      }
    },
    setSessionId: (state, value: PayloadAction<string>) => {
      state.sessionId = value.payload
    }
  },
});

export const { startLoading, stopLoading, addMessage, setSessionId } = sseSlice.actions;
export default sseSlice.reducer;