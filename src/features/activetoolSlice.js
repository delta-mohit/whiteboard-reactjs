import { createSlice } from "@reduxjs/toolkit";
import { TOOL_ITEMS } from "../constants";
const initialState = TOOL_ITEMS.BRUSH;
export const activetoolSlice = createSlice({
  name: "activetool",
  initialState,
  reducers: {
    setActiveTool: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const activetoolActions = activetoolSlice.actions;
export default activetoolSlice.reducer;
