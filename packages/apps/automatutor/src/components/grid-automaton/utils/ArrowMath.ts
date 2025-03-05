/**
 * Utility functions for mathematically precise SVG arrow rendering
 */

// Cell dimensions - these should be appropriate for your grid size
export const CELL_SIZE = 56;
export const CELL_CENTER = CELL_SIZE / 2;
export const STATE_RADIUS = CELL_SIZE * 0.35; // Adjusted to ensure arrows connect properly

// Arrow geometry constants
export const ARROW_HEAD_LENGTH = 8;
export const ARROW_HEAD_WIDTH = 6;
export const ARROW_STROKE_WIDTH = 2;
export const LABEL_OFFSET = 12;

/**
 * Calculate points for arrow head with proper extension to the wall
 */
export function calculateArrowHead(
  endX: number,
  endY: number,
  dirX: number,
  dirY: number,
): string {
  // Normalize direction vector
  const length = Math.sqrt(dirX * dirX + dirY * dirY);
  const normX = length > 0 ? dirX / length : dirX > 0 ? 1 : -1;
  const normY = length > 0 ? dirY / length : dirY > 0 ? 1 : -1;

  // Calculate perpendicular vector for arrow head width
  const perpX = -normY;
  const perpY = normX;

  // The tip should be extended to the wall (ARROW_HEAD_LENGTH distance in direction)
  const tipX = endX + normX * ARROW_HEAD_LENGTH;
  const tipY = endY + normY * ARROW_HEAD_LENGTH;

  // Calculate the three points of the arrow head
  const tip = { x: tipX, y: tipY };

  // The base corners of the arrow head at the line end point, offset perpendicular
  const left = {
    x: endX + (ARROW_HEAD_WIDTH / 2) * perpX,
    y: endY + (ARROW_HEAD_WIDTH / 2) * perpY,
  };

  const right = {
    x: endX - (ARROW_HEAD_WIDTH / 2) * perpX,
    y: endY - (ARROW_HEAD_WIDTH / 2) * perpY,
  };

  // Format as SVG polygon points
  return `${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`;
}

/**
 * Calculate self-loop with precise placement that stays closer to the cell
 */
export function calculateSelfLoop(side: 'left' | 'right' | 'top' | 'bottom'): {
  path: string;
  arrowHead: string;
  labelPos: { x: number; y: number; rotate: number };
} {
  // Control point distance - keep your preferred value
  const cpDistance = CELL_SIZE * 0.75;
  const gap = 20; // Gap between start/end points for visual clarity
  const labelOffset = -cpDistance; // Distance to position label away from the wall

  // This is the key change - pull end point inward by arrow head length
  const arrowHeadPullback = ARROW_HEAD_LENGTH;

  let startX, startY, endX, endY;
  let cp1x, cp1y, cp2x, cp2y;
  let labelX, labelY, labelRotate;

  switch (side) {
    case 'left':
      // Starting point at wall
      startX = 0;
      startY = CELL_CENTER - gap;

      // End point pulled back from wall by arrow head length
      endX = arrowHeadPullback;
      endY = CELL_CENTER + gap;

      // Control points create a loop INSIDE the cell
      cp1x = cpDistance;
      cp1y = CELL_CENTER - cpDistance;
      cp2x = cpDistance;
      cp2y = CELL_CENTER + cpDistance;

      labelX = -labelOffset;
      labelY = CELL_CENTER;
      labelRotate = 0;
      break;

    case 'right':
      // Starting point at wall
      startX = CELL_SIZE;
      startY = CELL_CENTER + gap;

      // End point pulled back from wall by arrow head length
      endX = CELL_SIZE - arrowHeadPullback;
      endY = CELL_CENTER - gap;

      cp1x = CELL_SIZE - cpDistance;
      cp1y = CELL_CENTER + cpDistance;
      cp2x = CELL_SIZE - cpDistance;
      cp2y = CELL_CENTER - cpDistance;

      labelX = CELL_SIZE + labelOffset;
      labelY = CELL_CENTER;
      labelRotate = 0;
      break;

    case 'top':
      // Starting point at wall
      startX = CELL_CENTER - gap;
      startY = 0;

      // End point pulled back from wall by arrow head length
      endX = CELL_CENTER + gap;
      endY = arrowHeadPullback;

      cp1x = CELL_CENTER - cpDistance;
      cp1y = cpDistance;
      cp2x = CELL_CENTER + cpDistance;
      cp2y = cpDistance;

      labelX = CELL_CENTER;
      labelY = -labelOffset;
      labelRotate = 0;
      break;

    case 'bottom':
      // Starting point at wall
      startX = CELL_CENTER + gap;
      startY = CELL_SIZE;

      // End point pulled back from wall by arrow head length
      endX = CELL_CENTER - gap;
      endY = CELL_SIZE - arrowHeadPullback;

      cp1x = CELL_CENTER + cpDistance;
      cp1y = CELL_SIZE - cpDistance;
      cp2x = CELL_CENTER - cpDistance;
      cp2y = CELL_SIZE - cpDistance;

      labelX = CELL_CENTER;
      labelY = CELL_SIZE + labelOffset;
      labelRotate = 0;
      break;
  }

  // Generate the path
  const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

  // Calculate tangent direction at the end point for proper arrow orientation
  // For cubic Bezier curves, the tangent at the end point is in the direction from cp2 to end point
  const dirX = endX - cp2x;
  const dirY = endY - cp2y;

  // Calculate arrow head points with directional vector
  const arrowHead = calculateArrowHead(endX, endY, dirX, dirY);

  return {
    path,
    arrowHead,
    labelPos: { x: labelX, y: labelY, rotate: labelRotate },
  };
}

/**
 * Calculate straight arrow parameters flush with cell walls
 */
export function calculateStraightArrow(
  from: 'left' | 'right' | 'top' | 'bottom',
  to: 'left' | 'right' | 'top' | 'bottom',
): {
  path: string;
  arrowHead: string;
  labelPos: { x: number; y: number; rotate: number };
} {
  let startX, startY, endX, endY;
  let dirX = 0,
    dirY = 0;
  let labelX,
    labelY,
    labelRotate = 0;

  // Set start point exactly on the originating wall
  switch (from) {
    case 'left':
      startX = 0;
      startY = CELL_CENTER;
      break;
    case 'right':
      startX = CELL_SIZE;
      startY = CELL_CENTER;
      break;
    case 'top':
      startX = CELL_CENTER;
      startY = 0;
      break;
    case 'bottom':
      startX = CELL_CENTER;
      startY = CELL_SIZE;
      break;
  }

  // Set end point exactly on the target wall, accounting for arrow head
  switch (to) {
    case 'left':
      endX = ARROW_HEAD_LENGTH; // Leave space for arrow head
      endY = CELL_CENTER;
      dirX = -1; // Arrow points left
      break;
    case 'right':
      endX = CELL_SIZE - ARROW_HEAD_LENGTH; // Leave space for arrow head
      endY = CELL_CENTER;
      dirX = 1; // Arrow points right
      break;
    case 'top':
      endX = CELL_CENTER;
      endY = ARROW_HEAD_LENGTH; // Leave space for arrow head
      dirY = -1; // Arrow points up
      break;
    case 'bottom':
      endX = CELL_CENTER;
      endY = CELL_SIZE - ARROW_HEAD_LENGTH; // Leave space for arrow head
      dirY = 1; // Arrow points down
      break;
  }

  // Position label based on orientation of the arrow
  if (from === 'left' || from === 'right' || to === 'left' || to === 'right') {
    // Horizontal arrow
    labelY = CELL_CENTER - LABEL_OFFSET;
    labelX = CELL_SIZE / 2;
    labelRotate = 0;
  } else {
    // Vertical arrow
    labelX = CELL_CENTER + LABEL_OFFSET;
    labelY = CELL_SIZE / 2;
    labelRotate = 90;
  }

  // Generate path connecting start and end points
  const path = `M ${startX} ${startY} L ${endX} ${endY}`;

  // Calculate arrow head
  const arrowHead = calculateArrowHead(endX, endY, dirX, dirY);

  return {
    path,
    arrowHead,
    labelPos: { x: labelX, y: labelY, rotate: labelRotate },
  };
}

/**
 * Calculate curved arrow between adjacent walls that properly curves through the center of the cell
 */
export function calculateCurvedArrow(
  from: 'left' | 'right' | 'top' | 'bottom',
  to: 'left' | 'right' | 'top' | 'bottom',
): {
  path: string;
  arrowHead: string;
  labelPos: { x: number; y: number; rotate: number };
} {
  let startX, startY, endX, endY;
  let dirX = 0,
    dirY = 0;
  let labelX,
    labelY,
    labelRotate = 0;

  // Set start point exactly on the originating wall
  switch (from) {
    case 'left':
      startX = 0;
      startY = CELL_CENTER;
      break;
    case 'right':
      startX = CELL_SIZE;
      startY = CELL_CENTER;
      break;
    case 'top':
      startX = CELL_CENTER;
      startY = 0;
      break;
    case 'bottom':
      startX = CELL_CENTER;
      startY = CELL_SIZE;
      break;
  }

  // Set end point exactly on the target wall accounting for arrow head
  switch (to) {
    case 'left':
      endX = ARROW_HEAD_LENGTH; // Leave space for arrow head
      endY = CELL_CENTER;
      dirX = -1; // Arrow points left
      break;
    case 'right':
      endX = CELL_SIZE - ARROW_HEAD_LENGTH; // Leave space for arrow head
      endY = CELL_CENTER;
      dirX = 1; // Arrow points right
      break;
    case 'top':
      endX = CELL_CENTER;
      endY = ARROW_HEAD_LENGTH; // Leave space for arrow head
      dirY = -1; // Arrow points up
      break;
    case 'bottom':
      endX = CELL_CENTER;
      endY = CELL_SIZE - ARROW_HEAD_LENGTH; // Leave space for arrow head
      dirY = 1; // Arrow points down
      break;
  }

  // Control points for cubic bezier curve passing through cell center
  const cp1x = (startX + CELL_CENTER) / 2;
  const cp1y = (startY + CELL_CENTER) / 2;
  const cp2x = (endX + CELL_CENTER) / 2;
  const cp2y = (endY + CELL_CENTER) / 2;

  // Larger offset for better label positioning (increased from 8 to 14)
  const labelOffset = 0;

  // Calculate label position based on the specific from-to combination
  // with larger offsets to avoid overlapping the curve
  switch (`${from}-${to}`) {
    case 'top-right':
      labelX = CELL_CENTER + labelOffset;
      labelY = CELL_CENTER - labelOffset;
      labelRotate = 0;
      break;
    case 'right-top':
      labelX = CELL_CENTER + labelOffset;
      labelY = CELL_CENTER - labelOffset;
      labelRotate = 0;
      break;
    case 'top-left':
      labelX = CELL_CENTER - labelOffset;
      labelY = CELL_CENTER - labelOffset;
      labelRotate = 0;
      break;
    case 'left-top':
      labelX = CELL_CENTER - labelOffset;
      labelY = CELL_CENTER - labelOffset;
      labelRotate = 0;
      break;
    case 'right-bottom':
      labelX = CELL_CENTER + labelOffset;
      labelY = CELL_CENTER + labelOffset;
      labelRotate = 0;
      break;
    case 'bottom-right':
      labelX = CELL_CENTER + labelOffset;
      labelY = CELL_CENTER + labelOffset;
      labelRotate = 0;
      break;
    case 'bottom-left':
      labelX = CELL_CENTER - labelOffset;
      labelY = CELL_CENTER + labelOffset;
      labelRotate = 0;
      break;
    case 'left-bottom':
      labelX = CELL_CENTER - labelOffset;
      labelY = CELL_CENTER + labelOffset;
      labelRotate = 0;
      break;
    default:
      labelX = CELL_CENTER;
      labelY = CELL_CENTER;
      labelRotate = 0;
  }

  // Create cubic bezier curve that passes through the center of the cell
  const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

  // Calculate arrow head
  const arrowHead = calculateArrowHead(endX, endY, dirX, dirY);

  return {
    path,
    arrowHead,
    labelPos: { x: labelX, y: labelY, rotate: labelRotate },
  };
}

/**
 * Get the appropriate arrow calculator for a given transition
 */
export function getArrowCalculator(
  from: 'left' | 'right' | 'top' | 'bottom',
  to: 'left' | 'right' | 'top' | 'bottom',
) {
  // Self loop case
  if (from === to) {
    return () => calculateSelfLoop(from);
  }

  // Opposite sides - straight arrows
  if (
    (from === 'left' && to === 'right') ||
    (from === 'right' && to === 'left') ||
    (from === 'top' && to === 'bottom') ||
    (from === 'bottom' && to === 'top')
  ) {
    return () => calculateStraightArrow(from, to);
  }

  // Adjacent sides - curved arrows
  return () => calculateCurvedArrow(from, to);
}
