import { configureStore } from "@reduxjs/toolkit";
import activetoolReducer from "../features/activetoolSlice";
import elementsReducer from "../features/elementsSlice";
import toolboxReducer from "../features/toolboxSlice";
import toolActionTypeReducer from "../features/toolActionTypeSlice";
import historyReducer from "../features/historySlice";
export const store = configureStore({
  reducer: {
    activetool: activetoolReducer,
    elements: elementsReducer,
    toolActionType: toolActionTypeReducer,
    toolbox: toolboxReducer,
    history: historyReducer,
  },
});
