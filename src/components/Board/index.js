import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import rough from "roughjs";
import { elementsAction } from "../../features/elementsSlice";
import { toolActionTypeActions } from "../../features/toolActionTypeSlice";
import { TOOL_ACTION_TYPE, TOOL_ITEMS } from "../../constants";
import styles from "./index.module.css";
import classNames from "classnames"; //for applying classess using conditional statements like if true then apply this class else apply that class
import { historyActions } from "../../features/historySlice";
import { isNearToTheElement } from "../../utils/element";
function Board() {
  const toolActionType = useSelector((store) => store.toolActionType);
  const activeTool = useSelector((store) => store.activetool);
  const dispatch = useDispatch();
  const canvasRef = useRef();
  const textAreaRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);
  const elements = useSelector((store) => store.elements);
  const toolboxState = useSelector((store) => store.toolbox);
  const handleMouseDown = (event) => {
    if (toolActionType === TOOL_ACTION_TYPE.WRITING) return; //Important :- Agar writing state me hai then apko canvas pe down click karne pe kuch nahi karna hai. Issliye return
    const canvas = canvasRef.current; ///////////// We are adjusting the position. I did this
    const rect = canvas.getBoundingClientRect(); // because
    const clientX = event.clientX - rect.left; // the cursor and the drawing line are not following each other.
    const clientY = event.clientY - rect.top; //Like there was an gap between cursor and drawing line.
    if (activeTool === TOOL_ITEMS.TEXT) {
      dispatch(toolActionTypeActions.setWriting());
      dispatch(
        elementsAction.handleMouseDown({ clientX, clientY, activeTool })
      );
      return;
    } else if (activeTool === TOOL_ITEMS.ERASER) {
      dispatch(toolActionTypeActions.setErasing());
    } else {
      dispatch(
        elementsAction.handleMouseDown({ clientX, clientY, activeTool })
      );
      dispatch(toolActionTypeActions.setDrawing());
    }
  };
  const handleMouseMove = (event) => {
    const canvas = canvasRef.current; ///////////// We are adjusting the position. I did this
    const rect = canvas.getBoundingClientRect(); // because
    const clientX = event.clientX - rect.left; // the cursor and the drawing line are not following each other.
    const clientY = event.clientY - rect.top; //Like there was an gap between cursor and drawing line.
    if (toolActionType === TOOL_ACTION_TYPE.WRITING) {
      return;
    }
    if (toolActionType === TOOL_ACTION_TYPE.DRAWING) {
      dispatch(
        elementsAction.handleMouseMove({
          clientX,
          clientY,
          activeTool,
          toolboxState,
        })
      );
    } else if (toolActionType === TOOL_ACTION_TYPE.ERASING) {
      let check = false; //"check" means kya erase hua hai koi bhi element
      let newElements = elements.filter((element) => {
        const flag = isNearToTheElement({
          element,
          clientX,
          clientY,
        });
        if (flag === true) check = true;
        return !flag;
      });
      dispatch(elementsAction.handleErasing(newElements));
      if (check === true) setelementsUpdated(!elementsUpdated); //agar check true hai matlab koi element erase hua hai, so uss wali board ki state ko push kar do history wale array me
    }
  };

  const handleMouseUp = () => {
    if (toolActionType === TOOL_ACTION_TYPE.WRITING) {
      return;
    }
    if (toolActionType === TOOL_ACTION_TYPE.DRAWING) {
      setelementsUpdated(!elementsUpdated); //elements update hua hai, so bata do useEffect ko taaki vo history wale array me elements ko push kar de
    }
    dispatch(toolActionTypeActions.setNone());
  };

  const onTextAreaBlur = (event) => {
    const text = event.target.value;
    const size = toolboxState[TOOL_ITEMS.TEXT].size;
    const stroke = toolboxState[TOOL_ITEMS.TEXT].stroke;
    dispatch(toolActionTypeActions.setNone());
    dispatch(elementsAction.textAreaBlurHandler({ text, size, stroke }));
    setelementsUpdated(!elementsUpdated);
  };
  // -------------------------------------------------

  //Below code is the logic of pushing board state into history array, but only when jab board state update hua ho
  const [elementsUpdated, setelementsUpdated] = useState(0); //elements update hoga to hum iss useState ki help se sabko bata denge ki elements update hua hai
  useEffect(() => {
    //this useEffect tab trigger hoga jab elements array update hoga, so agar elements array update hua hai to elements array ko history me push kar do
    dispatch(historyActions.createHistory(elements));
  }, [elementsUpdated]);

  // ---------------------------------------------------------
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();

    const roughCanvas = rough.canvas(canvas);
    //drawing the elements on the canvas
    elements.forEach((element) => {
      const type = element.type;
      switch (type) {
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.CIRCLE:
          if (element.roughEle) {
            roughCanvas.draw(element.roughEle);
          }
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Arial`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        default:
          throw Error(
            "Tool item type is not recognised like it is brush or line etc et"
          );
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textAr = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPE.WRITING) {
      setTimeout(() => {
        textAr.focus();
      }, 0);
    }
  }, [toolActionType]);

  return (
    <>
      {toolActionType === TOOL_ACTION_TYPE.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={styles.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${toolboxState[TOOL_ITEMS.TEXT].size}px`,
            color: toolboxState[TOOL_ITEMS.TEXT].stroke,
          }}
          onBlur={(event) => onTextAreaBlur(event)}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        className={classNames({
          [styles.canvasDrawing]: toolActionType === TOOL_ACTION_TYPE.ERASING,
        })}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
