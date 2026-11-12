import { useState } from 'react';
import { formatShortDate } from '../utils/dates.js';
import './Sparkline.css';

const WIDTH = 120;
const HEIGHT = 32;
const STRETCH_HEIGHT = 56; // taller version for wide places
const PADDING = 3; // keeps the line from touching the top and bottom edges
const FILL_OPACITY = 0.12;

// Tiny line chart of the last days. Hovering shows the date and score of a day.
// points: [{ date, score }], score can be null (no data that day).
// stretch: fill the whole width of the parent and draw a soft area under the line.
function Sparkline({ points, color, stretch = false }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const scores = points.map((point) => point.score).filter((score) => score !== null);
  if (scores.length < 2) {
    return <span className="sparkline__empty">—</span>;
  }

  const height = stretch ? STRETCH_HEIGHT : HEIGHT;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const step = WIDTH / (points.length - 1);

  // Highest score at the top, lowest at the bottom.
  function toY(score) {
    if (max === min) {
      return height / 2; // all scores equal -> flat line in the middle
    }
    return PADDING + ((max - score) / (max - min)) * (height - 2 * PADDING);
  }

  // Screen position of every day; null for days without data.
  const coords = points.map((point, index) =>
    point.score === null ? null : { x: index * step, y: toY(point.score), point },
  );

  const visible = coords.filter((coord) => coord !== null);
  const line = visible.map((coord) => `${coord.x},${coord.y}`).join(' ');

  // The line, closed down to the bottom edge: the shape of the soft fill.
  const area = `${visible[0].x},${height} ${line} ${visible.at(-1).x},${height}`;

  const hovered = hoveredIndex === null ? null : coords[hoveredIndex];

  // When stretched, CSS resizes the svg, so the left position is given in percent.
  const hoveredLeft = hovered && (stretch ? `${(hovered.x / WIDTH) * 100}%` : hovered.x);

  return (
    <div
      className={stretch ? 'sparkline sparkline--stretch' : 'sparkline'}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <svg
        width={stretch ? '100%' : WIDTH}
        height={height}
        viewBox={`0 0 ${WIDTH} ${height}`}
        preserveAspectRatio={stretch ? 'none' : undefined}
        aria-hidden="true"
      >
        {stretch && <polygon points={area} fill={color} fillOpacity={FILL_OPACITY} />}

        <polyline
          points={line}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {hovered && !stretch && <circle cx={hovered.x} cy={hovered.y} r="3" fill={color} />}

        {/* invisible column around every day: hovering it selects that day */}
        {coords.map(
          (coord, index) =>
            coord && (
              <rect
                key={coord.point.date}
                x={coord.x - step / 2}
                y="0"
                width={step}
                height={height}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
              />
            ),
        )}
      </svg>

      {/* in stretch mode a circle inside the svg would become an oval, so the dot is HTML */}
      {hovered && stretch && (
        <span
          className="sparkline__dot"
          style={{ left: hoveredLeft, top: hovered.y, background: color }}
        />
      )}

      {hovered && (
        <div className="sparkline__tooltip" style={{ left: hoveredLeft }}>
          {formatShortDate(hovered.point.date)} · {hovered.point.score}
        </div>
      )}
    </div>
  );
}

export default Sparkline;
