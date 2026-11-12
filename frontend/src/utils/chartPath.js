// Smooth line through points [{ x, y }] for an SVG <path>.
// Each segment is a cubic Bézier curve with horizontal tangents at both ends,
// so the curve never goes above or below the real values between two points.
export function buildSmoothPath(points) {
  if (points.length === 0) {
    return '';
  }

  const start = `M${points[0].x},${points[0].y}`;
  const curves = points.slice(1).map((point, index) => {
    const previous = points[index];
    const midX = (previous.x + point.x) / 2;
    return `C${midX},${previous.y} ${midX},${point.y} ${point.x},${point.y}`;
  });

  return [start, ...curves].join(' ');
}
