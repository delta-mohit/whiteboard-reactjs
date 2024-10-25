import { createSlice } from "@reduxjs/toolkit";
import { TOOL_ITEMS, COLORS } from "../constants";
const initialState = {
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 20,
  },
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
  },
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
};

export const toolboxSlice = createSlice({
  name: "toolbox",
  initialState,
  reducers: {
    changeStroke: (state, action) => {
      const { tool, color } = action.payload;
      state[tool].stroke = color;
    },
    changeFill: (state, action) => {
      const { tool, color } = action.payload;
      state[tool].fill = color;
    },
    changeSize: (state, action) => {
      const { tool, size } = action.payload;
      state[tool].size = size;
    },
  },
});

export const toolboxActions = toolboxSlice.actions;
export default toolboxSlice.reducer;
