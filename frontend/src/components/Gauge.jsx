import { getStressBand } from '../utils/stressBands.js';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber.js';
import './Gauge.css';

// Geometry in SVG canvas units (the whole drawing is scaled by CSS).
const VIEW_BOX = '24 24 192 122';
const CENTER = 120; // center of the gauge (same for x and y)
const RADIUS = 90; // radius of the arc
const STROKE = 6; // arc thickness

const TICKS = [0, 25, 50, 75, 100]; // zone borders
const TICK_GAP = 3; // space between the arc and a tick
const TICK_LENGTH = 8;
const TICK_WIDTH = 2;
const TICK_OUTER = RADIUS - STROKE / 2 - TICK_GAP; // 84
const TICK_INNER = TICK_OUTER - TICK_LENGTH; // 76

const VALUE_Y = CENTER - 10; // big number, a bit above the center line
const LABEL_Y = CENTER + 16; // status label, under the number

// Half circle from the left end to the right end, going over the top.
const ARC_PATH = `M${CENTER - RADIUS} ${CENTER} A${RADIUS} ${RADIUS} 0 0 1 ${CENTER + RADIUS} ${CENTER}`;

// Point on a circle around the gauge center for a value 0-100.
// 0 = left end, 50 = top, 100 = right end.
function pointOnArc(value, radius) {
  const angle = Math.PI * (1 - value / 100);
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER - radius * Math.sin(angle),
  };
}

// Semicircle gauge. When the page opens it animates from 0 to the score:
// the arc grows, ticks light up as the arc reaches them, color and label follow the zones.
function Gauge({ score }) {
  const shown = useAnimatedNumber(score); // grows from 0 to score
  const band = getStressBand(shown); // current zone during the animation

  return (
    <svg
      className="gauge"
      viewBox={VIEW_BOX}
      role="img"
      aria-label={`Stress score ${score} of 100, ${getStressBand(score).label}`}
    >
      {/* grey track: the whole arc */}
      <path d={ARC_PATH} fill="none" stroke="var(--border)" strokeWidth={STROKE} />

      {/* colored arc: only the first `shown` percent of the same path is drawn */}
      {shown > 0 && (
        <path
          d={ARC_PATH}
          fill="none"
          stroke={band.color}
          strokeWidth={STROKE}
          pathLength="100"
          strokeDasharray={`${shown} 100`}
        />
      )}

      {/* ticks on zone borders: they light up when the arc reaches them */}
      {TICKS.map((tick) => {
        const outer = pointOnArc(tick, TICK_OUTER);
        const inner = pointOnArc(tick, TICK_INNER);
        const passed = shown > 0 && tick <= shown;

        return (
          <line
            key={tick}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke={passed ? band.color : 'var(--tick)'}
            strokeWidth={TICK_WIDTH}
          />
        );
      })}

      <text x={CENTER} y={VALUE_Y} textAnchor="middle" className="gauge__value">
        {Math.round(shown)}
      </text>
      <text x={CENTER} y={LABEL_Y} textAnchor="middle" fill={band.color} className="gauge__label">
        {band.label}
      </text>
    </svg>
  );
}

export default Gauge;
