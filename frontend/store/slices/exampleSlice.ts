import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state structure
interface ExampleState {
  value: number;
}

const initialState: ExampleState = {
  value: 0,
};

// Create the slice
const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

// Export actions for use in components
export const { increment, decrement, setValue } = exampleSlice.actions;

// Export the reducer to be added to the store
export default exampleSlice.reducer;