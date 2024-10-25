import { createSlice } from "@reduxjs/toolkit";
import { drawShape, getSvgPathFromStroke } from "../utils/element";
import { TOOL_ITEMS } from "../constants";
import getStroke from "perfect-freehand";

const initialState = [];
const elementSlice = createSlice({
  name: "elements",
  initialState,
  reducers: {
    handleMouseDown: (state, action) => {
      const { clientX, clientY, activeTool } = action.payload;
      let newElement = {};
      switch (activeTool) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.CIRCLE:
          newElement = {
            id: state.length,
            x1: clientX,
            y1: clientY,
            x2: clientX,
            y2: clientY,
            type: activeTool,
          };
          break;
        case TOOL_ITEMS.BRUSH:
          let pointsArr = [{ x: clientX, y: clientY }];
          newElement = {
            id: state.length,
            points: pointsArr,
            path: new Path2D(getSvgPathFromStroke(getStroke(pointsArr))),
            type: activeTool,
            stroke: "",
          };
          break;
        case TOOL_ITEMS.TEXT:
          newElement = {
            id: state.length,
            x1: clientX,
            y1: clientY,
            size: "",
            text: "",
            type: activeTool,
          };
          break;
        default:
          throw new Error("activeTool is not recorginsed");
      }
      state.push(newElement);
    },
    handleMouseMove: (state, action) => {
      const { clientX, clientY, activeTool, toolboxState } = action.payload;
      //drawing on board
      const index = state.length - 1;
      let element = state[index];
      drawShape(element, clientX, clientY, activeTool, toolboxState);
    },
    handleErasing: (state, action) => {
      const newElements = action.payload;
      return newElements;
    },
    textAreaBlurHandler: (state, action) => {
      const { text, size, stroke } = action.payload;
      let element = state[state.length - 1];
      element.text = text;
      element.size = size;
      element.stroke = stroke;
    },
    undoHandler: (state, action) => {
      state = action.payload;
      return state; //we need to return the new state
    },
    redoHandler: (state, action) => {
      return action.payload; //yaha pe direclty jo state aa raha tha wahi return kara diya unlike assigning it into state variable and then return
    },
  },
});
export const elementsAction = elementSlice.actions;
export default elementSlice.reducer;
