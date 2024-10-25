import { createSlice } from "@reduxjs/toolkit";
import { TOOL_ACTION_TYPE } from "../constants";
const initialState = TOOL_ACTION_TYPE.NONE;
const toolActionTypeSlice = createSlice({
  name: "toolActionType",
  initialState,
  reducers: {
    setErasing: () => {
      return TOOL_ACTION_TYPE.ERASING;
    },
    setDrawing: () => {
      return TOOL_ACTION_TYPE.DRAWING;
    },
    setWriting: () => {
      return TOOL_ACTION_TYPE.WRITING;
    },
    setNone: () => {
      return TOOL_ACTION_TYPE.NONE;
    },
  },
});

export const toolActionTypeActions = toolActionTypeSlice.actions;
export default toolActionTypeSlice.reducer; // ye mein bhul jata hu
