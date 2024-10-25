import React from "react";
import classNames from "classnames"; //for setting conditional style
import styles from "./index.module.css";
import {
  COLORS,
  FILL_TOOL_TYPES,
  SIZE_TOOL_ITEMS,
  STROKE_TOOL_TYPES,
  TOOL_ITEMS,
} from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { toolboxActions } from "../../features/toolboxSlice";
const Toolbox = () => {
  const dispatch = useDispatch();
  const tool = useSelector((store) => store.activetool);
  const toolObj = useSelector((store) => store.toolbox);
  const strokeColor = toolObj[tool]?.stroke;
  const fillColor = toolObj[tool]?.fill;
  const size = toolObj[tool]?.size;
  const handleStrokeColorChange = (tool, color) => {
    dispatch(toolboxActions.changeStroke({ tool, color }));
  };
  const handleFillColorChange = (tool, color) => {
    dispatch(toolboxActions.changeFill({ tool, color }));
  };
  const handleSizeChange = (tool, size) => {
    dispatch(toolboxActions.changeSize({ tool, size }));
  };

  return (
    <div className={styles.container}>
      {STROKE_TOOL_TYPES.includes(tool) && (
        <div className={styles.selectOptionContainer}>
          <div className={styles.toolBoxLabel}>Stroke Color</div>
          <div className={styles.colorsContainer}>
            <div>
              <input
                className={styles.colorPicker}
                type="color"
                value={strokeColor}
                onChange={(e) => handleStrokeColorChange(tool, e.target.value)}
              ></input>
            </div>
            {Object.keys(COLORS).map((k) => {
              return (
                <div
                  key={COLORS[k]}
                  className={classNames(styles.colorBox, {
                    [styles.activeColorBox]: strokeColor === COLORS[k],
                  })}
                  style={{ backgroundColor: COLORS[k] }}
                  onClick={() => handleStrokeColorChange(tool, COLORS[k])}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      {FILL_TOOL_TYPES.includes(tool) && (
        <div className={styles.selectOptionContainer}>
          <div className={styles.toolBoxLabel}>Fill Color</div>
          <div className={styles.colorsContainer}>
            {fillColor === null ? (
              <div
                className={classNames(
                  styles.colorPicker,
                  styles.noFillColorBox
                )}
                onClick={() => handleFillColorChange(tool, COLORS.BLACK)}
              ></div>
            ) : (
              <div>
                <input
                  className={styles.colorPicker}
                  type="color"
                  value={fillColor}
                  onChange={(e) => handleFillColorChange(tool, e.target.value)}
                ></input>
              </div>
            )}
            <div
              className={classNames(styles.colorBox, styles.noFillColorBox, {
                [styles.activeColorBox]: fillColor === null,
              })}
              onClick={() => handleFillColorChange(tool, null)}
            ></div>
            {Object.keys(COLORS).map((k) => {
              return (
                <div
                  key={COLORS[k]}
                  className={classNames(styles.colorBox, {
                    [styles.activeColorBox]: fillColor === COLORS[k],
                  })}
                  style={{ backgroundColor: COLORS[k] }}
                  onClick={() => handleFillColorChange(tool, COLORS[k])}
                ></div>
              );
            })}
          </div>
        </div>
      )}
      {SIZE_TOOL_ITEMS.includes(tool) && (
        <div className={styles.selectOptionContainer}>
          <div className={styles.toolBoxLabel}>
            {tool === TOOL_ITEMS.TEXT ? "Text Size" : "Brush Size"}
          </div>
          <div className={styles.colorsContainer}>
            <input
              id="default-range"
              type="range"
              value={size}
              min={tool === TOOL_ITEMS.TEXT ? 20 : 1}
              max={tool === TOOL_ITEMS.TEXT ? 100 : 10}
              onChange={(event) => handleSizeChange(tool, event.target.value)}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-300"
            ></input>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
