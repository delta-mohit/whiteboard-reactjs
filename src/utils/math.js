import { ELEMENT_ERASE_THRESHOLD } from "../constants";

export const arrowHeadCoordinates = (x1, y1, x2, y2, arrowLength) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  let x3 = x2 - arrowLength * Math.cos(angle - Math.PI / 6);
  let y3 = y2 - arrowLength * Math.sin(angle - Math.PI / 6);
  let x4 = x2 - arrowLength * Math.cos(angle + Math.PI / 6);
  let y4 = y2 - arrowLength * Math.sin(angle + Math.PI / 6);
  return {
    x3,
    y3,
    x4,
    y4,
  };
};

export const isPointCloseToLine = (x1, y1, x2, y2, pointX, pointY) => {
  const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY); //Niche define kiya hai mein dist b/w two points wala function
  const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
  const distLine = distanceBetweenPoints(x1, y1, x2, y2);
  return Math.abs(distToStart + distToEnd - distLine) < ELEMENT_ERASE_THRESHOLD;
};

const distanceBetweenPoints = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};