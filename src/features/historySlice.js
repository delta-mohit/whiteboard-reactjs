import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [[]], //first there is an empty array in history
  index: 0,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    createHistory: (state, action) => {
      const newElements = action.payload;
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(newElements);
      state.history = newHistory; //history array updated
      state.index = state.index + 1; //index updated
    },
    updateIndex: (state, action) => {
      state.index = action.payload;
    },
  },
});

export const historyActions = historySlice.actions;
export default historySlice.reducer;
