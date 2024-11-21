import React from "react";
import styles from "./index.module.css";
import { BiRectangle } from "react-icons/bi";
import { BsArrowUpRight } from "react-icons/bs";

import {
  FaRegCircle,
  FaSlash,
  FaPaintBrush,
  FaEraser,
  FaUndo,
  FaRedo,
  FaDownload,
  FaFont,
} from "react-icons/fa";
import classNames from "classnames"; //for applying conditional classname
import { useDispatch, useSelector } from "react-redux";
import { activetoolActions } from "../../features/activetoolSlice";
import { TOOL_ITEMS } from "../../constants";
import { elementsAction } from "../../features/elementsSlice";
import { historyActions } from "../../features/historySlice";
function Toolbar() {
  const dispatch = useDispatch();
  const active = useSelector((store) => store.activetool);
  const historyObj = useSelector((store) => store.history);
  const onUndoClickHandler = () => {
    const historyArr = historyObj.history;
    const index = historyObj.index;
    if (index <= 1) return; //mera phela element of history array is empty array. And pata nahi kyu ki mere history array me bina kuch kiye hi 2 more empty entries aa rahi hai. Issliye actually, board state index 3 se push hona start ho rahi hai. Ye issliye ho raha hai shyd, because mein history array me push karne ke liye useEffect ka use kar raha hu, jo ki initial render pe bhi run ho jayega and unncessary entry push kar dega in history array. Redux state me check kar lena History array ko, waha dikh jayega.

    //In deployed project, useEffect runs once and in local host, it is running twice. So using index>=1 is safe
    dispatch(elementsAction.undoHandler(historyArr[index - 1]));
    dispatch(historyActions.updateIndex(index - 1));
  };
  const onRedoClickHandler = () => {
    const historyArr = historyObj.history;
    const index = historyObj.index;
    if (index >= historyArr.length - 1) return;
    dispatch(elementsAction.redoHandler(historyArr[index + 1]));
    dispatch(historyActions.updateIndex(index + 1));
  };
  const onDownloadClickHandler = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  };

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.tool, {
          [styles.active]: active === TOOL_ITEMS.BRUSH,
        })}
        onClick={() =>
          dispatch(activetoolActions.setActiveTool(TOOL_ITEMS.BRUSH))
        }
      >
        <FaPaintBrush />
      </div>

      <div
        className={classNames(styles.tool, {
          [styles.active]: active === TOOL_ITEMS.RECTANGLE,
        })}
        onClick={() =>
          dispatch(activetoolActions.setActiveTool(TOOL_ITEMS.RECTANGLE))
        }
      >
        <BiRectangle />
      </div>
      <div
        className={classNames(styles.tool, {
          [styles.active]: active === TOOL_ITEMS.LINE,
        })}
        onClick={() =>
          dispatch(activetoolActions.setActiveTool(TOOL_ITEMS.LINE))
        }
      >
        <FaSlash />
      </div>

      <div
        className={classNames(styles.tool, {
          [styles.active]: active === TOOL_ITEMS.CIRCLE,
        })}
        onClick={() =>
          dispatch(activetoolActions.setActiveTool(TOOL_ITEMS.CIRCLE))
        }
      >
        <FaRegCircle />
      </div>

      <div
        className={classNames(styles.tool, {
          [styles.active]: active === TOOL_ITEMS.ARROW,
        })}
        onClick={() =>
          dispatch(activetoolActions.setActiveTool(TOOL_ITEMS.ARROW))
        }
      >
        <BsArrowUpRight />
      </div>

      <div
        className={classNames(styles.tool, {
          [styles.active]: active === TOOL_ITEMS.ERASER,
        })}
        onClick={() =>
          dispatch(activetoolActions.setActiveTool(TOOL_ITEMS.ERASER))
        }
      >
        <FaEraser />
      </div>

      <div
        className={classNames(styles.tool, {
          [styles.active]: active === TOOL_ITEMS.TEXT,
        })}
        onClick={() =>
          dispatch(activetoolActions.setActiveTool(TOOL_ITEMS.TEXT))
        }
      >
        <FaFont />
      </div>

      <div
        className={styles.tool}
        onClick={() => {
          onUndoClickHandler();
        }}
      >
        <FaUndo />
      </div>

      <div
        className={styles.tool}
        onClick={() => {
          onRedoClickHandler();
        }}
      >
        <FaRedo />
      </div>

      <div
        className={styles.tool}
        onClick={() => {
          onDownloadClickHandler();
        }}
      >
        <FaDownload />
      </div>
    </div>
  );
}

export default Toolbar;
