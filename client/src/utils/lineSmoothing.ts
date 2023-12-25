import { Point } from "@/types/drawing";
import { DrawingInfo } from "@/hooks/useDraw";

export function simplifyLine(points: DrawingInfo[], tolerance: number): DrawingInfo[] {
    if (points.length <= 2) {
        return points;
    }

    // Calculate distances
    const distances = points.map((point, index) => {
        if (index === 0 || index === points.length - 1) {
            return Number.MAX_SAFE_INTEGER; // Skip the first and last points
        } else {
            const distance = perpendicularDistance(
                point.originalCurrPoint,
                points[0].originalPrevPoint,
                points[points.length - 1].originalCurrPoint
            );
            return distance;
        }
    });

    // Find the point with the maximum distance
    const maxDistance = Math.max(...distances);
    const maxIndex = distances.indexOf(maxDistance);

    // Check if the maximum distance is greater than the tolerance
    if (maxDistance > tolerance) {
        const firstPart = simplifyLine(points.slice(0, maxIndex + 1), tolerance);
        const secondPart = simplifyLine(points.slice(maxIndex, points.length), tolerance);

        // Combine simplified parts, removing the duplicated point
        return [...firstPart.slice(0, -1), ...secondPart];
    } else {
        return [points[0], points[points.length - 1]];
    }
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
    const { x: startX, y: startY } = lineStart;
    const { x: endX, y: endY } = lineEnd;
    const { x, y } = point;

    const numerator = Math.abs((endX - startX) * (startY - y) - (startX - x) * (endY - startY));
    const denominator = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    return numerator / denominator;
}