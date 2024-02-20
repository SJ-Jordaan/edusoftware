const RIGHT_ARROW_HEAD = "56,28 46,23 46,33";
const LEFT_ARROW_HEAD = "0,28 10,23 10,33";
const UP_ARROW_HEAD = "28,0 23,10 33,10";
const DOWN_ARROW_HEAD = "28,56 23,46 33,46";

export const ARROW_PIECES = {
  "left-right": {
    pathD: "M 0 28 L 46 28",
    polygonPoints: RIGHT_ARROW_HEAD,
    textPosition: { x: 18, y: 25 },
  },
  "right-left": {
    pathD: "M 10 28 L 56 28",
    polygonPoints: LEFT_ARROW_HEAD,
    textPosition: { x: 22, y: 25 },
  },
  "top-bottom": {
    pathD: "M 28 0 L 28 46",
    polygonPoints: DOWN_ARROW_HEAD,
    textPosition: { x: 24, y: 33, rotate: -90 },
  },
  "bottom-top": {
    pathD: "M 28 56 L 28 10",
    polygonPoints: UP_ARROW_HEAD,
    textPosition: { x: 24, y: 38, rotate: -90 },
  },
  "top-right": {
    pathD: "M 28 0 Q 28 28 56 28",
    polygonPoints: RIGHT_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "right-top": {
    pathD: "M 56 28 Q 28 28 28 0",
    polygonPoints: UP_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "top-left": {
    pathD: "M 28 0 Q 28 28 0 28",
    polygonPoints: LEFT_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "left-top": {
    pathD: "M 0 28 Q 28 28 28 0",
    polygonPoints: UP_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "right-bottom": {
    pathD: "M 56 28 Q 28 28 28 56",
    polygonPoints: DOWN_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "bottom-right": {
    pathD: "M 28 56 Q 28 28 56 28",
    polygonPoints: RIGHT_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "bottom-left": {
    pathD: "M 28 56 Q 28 28 0 28",
    polygonPoints: LEFT_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "left-bottom": {
    pathD: "M 0 28 Q 28 28 28 56",
    polygonPoints: DOWN_ARROW_HEAD,
    textPosition: { x: 18, y: 32 },
  },
  "left-left": {
    pathD:
      "M 0 16.799999999999997 C 5.6 5.6 33.599999999999994 0 33.599999999999994 28 C 33.599999999999994 56 5.6 50.4 0 39.199999999999996",
    polygonPoints: null,
    textPosition: { x: 38, y: 18, rotate: 90 },
  },
  "right-right": {
    pathD:
      "M 56 39.199999999999996 C 50.4 50.4 22.4 56 22.4 28 C 22.4 0 50.4 5.6 56 16.799999999999997",
    polygonPoints: null,
    textPosition: { x: 18, y: 38, rotate: -90 },
  },
  "top-top": {
    pathD:
      "M 39.199999999999996 0 C 50.4 5.6 56 33.599999999999994 28 33.599999999999994 C 0 33.599999999999994 5.6 5.6 16.799999999999997 0",
    polygonPoints: null,
    textPosition: { x: 21, y: 45, rotate: 0 },
  },
  "bottom-bottom": {
    pathD:
      "M 16.799999999999997 56 C 5.6 50.4 0 22.4 28 22.4 C 56 22.4 50.4 50.4 39.199999999999996 56",
    polygonPoints: null,
    textPosition: { x: 18, y: 18, rotate: 0 },
  },
};
