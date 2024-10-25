import getStroke from "perfect-freehand";
import { ARROW_LENGTH, TOOL_ITEMS } from "../constants";
import { arrowHeadCoordinates, isPointCloseToLine } from "./math";
import roughForGenerator from "roughjs/bin/rough";
const gen = roughForGenerator.generator();

export const drawShape = (
  //I should rename this drawShape, give an appropriate name
  element,
  clientX,
  clientY,
  activeTool,
  toolboxState
) => {
  const specifications = toolboxState[activeTool];
  let x1 = element.x1,
    y1 = element.y1,
    x2 = clientX,
    y2 = clientY;
  let options = {
    seed: element.id + 1, //seed can't be zero. //Iss seed ka jayda use samjh aya nahi hai mereko.
    fillStyle: "solid", // solid filling karega in the shape
  };
  if (specifications.stroke) options.stroke = specifications.stroke;
  if (specifications.fill) options.fill = specifications.fill;
  if (specifications.size) options.strokeWidth = specifications.size;

  switch (activeTool) {
    case TOOL_ITEMS.BRUSH:
      element.points = [...element.points, { x: clientX, y: clientY }];
      element.path = new Path2D(
        getSvgPathFromStroke(getStroke(element.points))
      );
      element.stroke = specifications.stroke;
      return element;
    case TOOL_ITEMS.LINE:
      element.x2 = clientX;
      element.y2 = clientY;
      element.roughEle = gen.line(
        element.x1,
        element.y1,
        element.x2,
        element.y2,
        options //Jab mein cursor move kar raha tha tab har baar nayi handwritten style generate ho rahi thi. Isse ye hoga ki jab hum shape draw kar rahe honge tab nayi handwritten style generate nahi karega balki seed me se le lega
      );
      return element;

    case TOOL_ITEMS.RECTANGLE:
      const width = clientX - element.x1;
      const height = clientY - element.y1;
      element.x2 = clientX;
      element.y2 = clientY;
      element.roughEle = gen.rectangle(
        element.x1,
        element.y1,
        width,
        height,
        options //Jab mein cursor move kar raha tha tab har baar nayi handwritten style generate ho rahi thi. Isse ye hoga ki jab hum shape draw kar rahe honge tab nayi handwritten style generate nahi karega balki seed me se le lega
      );
      return element;

    case TOOL_ITEMS.CIRCLE:
      element.x2 = clientX; //Erase karne ke logic me mereko (x1,y1) and (x2,y2) dono chaiye..
      element.y2 = clientY; // since (x1,y1) to hai humare element me, lekin (x2,y2) me clientX, clientY set karna padega
      const EllipseWidth = x2 - x1;
      const EllipseHeight = y2 - y1;
      const centerX = (x2 + x1) / 2;
      const centerY = (y2 + y1) / 2;
      element.roughEle = gen.ellipse(
        centerX,
        centerY,
        EllipseWidth,
        EllipseHeight,
        options
      );
      return element;

    case TOOL_ITEMS.ARROW:
      const { x3, y3, x4, y4 } = arrowHeadCoordinates(
        x1,
        y1,
        x2,
        y2,
        ARROW_LENGTH
      );
      const points = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x2, y2],
        [x4, y4],
      ];
      element.x2 = clientX; // Code line 1
      element.y2 = clientY; // Code line 2
      //Code line 1 & 2 rakhna bhot zaruri hai because jab mein eraser se delete karta hu iss arrow ko then mereko
      // (x1,y1) and (x2,y2) done chaiye. Since arrow draw me draw karte time (x2,y2) ko set karne ki zarurat nahi hai because arrow to linearPath se ban raha hai. Issliye mereko ye set karne padenge (x2,y2), kyuki eraser ke logic me zarurat hai iski.

      element.roughEle = gen.linearPath(points, options);
      return element;

    default:
      break;
  }
};

export function isNearToTheElement({ element, clientX, clientY }) {
  const { x1, y1, x2, y2, type } = element; //"type" is the element which I wanted to delete
  const context = document.getElementById("canvas").getContext("2d"); //ye issliye kiya hai taaki canvas ka access mil jaaye. Because hume "context" chaiye but actual meaning smjh nahi aya mereko. Baad me samjhunga.
  let pointX = clientX;
  let pointY = clientY;
  switch (type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.ARROW:
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.CIRCLE:
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
      );
    case TOOL_ITEMS.BRUSH:
      return context.isPointInPath(element.path, pointX, pointY); // "isPointInPath" is a method using which we can find does that point exist in path or not. "isPointInPath" ke baare me padhna and how we use this, padhna baaki hai.
    case TOOL_ITEMS.TEXT:
      context.font = `${element.size}px Arial`;
      context.fillStyle = element.stroke;
      const textWidth = context.measureText(element.text).width;
      const textHeight = parseInt(element.size);
      context.restore();
      return (
        isPointCloseToLine(x1, y1, x1 + textWidth, y1, pointX, pointY) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1,
          x1 + textWidth,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(
          x1 + textWidth,
          y1 + textHeight,
          x1,
          y1 + textHeight,
          pointX,
          pointY
        ) ||
        isPointCloseToLine(x1, y1 + textHeight, x1, y1, pointX, pointY)
      );
    default:
      throw console.error("Type nor defined while erasing");
  }
}

export function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
