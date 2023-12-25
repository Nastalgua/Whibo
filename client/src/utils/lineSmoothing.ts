import { Point } from "@/types/drawing";

export function simplifyLine(points: Point[], tolerance: number = 1.0) : Point[] {
  if (points.length <= 2) {
      return points;
  }

  // Find the point with the maximum distance
  let maxDistance = 0;
  let maxIndex = 0;

  const end = points.length - 1;
  const start = 0;
  
  for (let i = 1; i < end; i++) {
      const distance = perpendicularDistance(points[i], points[start], points[end]);

      if (distance > maxDistance) {
          maxDistance = distance;
          maxIndex = i;
      }
  }

  // If the maximum distance is greater than the tolerance, recursively simplify
  if (maxDistance > tolerance) {
      const firstPart: Point[] = simplifyLine(points.slice(0, maxIndex + 1), tolerance);
      const secondPart: Point[] = simplifyLine(points.slice(maxIndex, points.length), tolerance);

      return firstPart.slice(0, firstPart.length - 1).concat(secondPart);
  } else {
      return [points[start], points[end]];
  }
}

// Function to calculate the perpendicular distance
function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point) {
  const { x: startX, y: startY } = lineStart;
  const { x: endX, y: endY } = lineEnd;
  const { x, y } = point;

  const numerator = Math.abs((endX - startX) * (startY - y) - (startX - x) * (endY - startY));
  const denominator = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

  return numerator / denominator;
}
