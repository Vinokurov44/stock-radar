import { useState } from 'react';

import { STRESS_BANDS, getStressBand, getChangeColor } from '../utils/stressBands.js';
import { formatChange } from '../utils/changes.js';
import { formatShortDate } from '../utils/dates.js';
import { buildSmoothPath } from '../utils/chartPath.js';
import HistoryTooltip from './HistoryTooltip.jsx';
import './RadarHistoryChart.css';

// Drawing area in SVG units (the whole chart is scaled to the card width by CSS).
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 270;
const PLOT_LEFT = 114;
const PLOT_RIGHT = 930;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 220;
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT;
const PLOT_HEIGHT = PLOT_BOTTOM - PLOT_TOP;

const ZONE_LABEL_X = 80; // zone names, right-aligned
const ZONE_BAR_X = 92; // colored zone strips
const AXIS_LABEL_X = 945; // 0..100 numbers on the right
const DATE_LABEL_Y = 250; // dates under the chart

const FILL_TOP_OPACITY = 0.35; // area fill near the top of the chart
const FILL_BOTTOM_OPACITY = 0; // and fully transparent at the bottom

// Score 0-100 -> vertical position: 0 at the bottom, 100 at the top.
function yFor(score) {
  return PLOT_BOTTOM - (score / 100) * PLOT_HEIGHT;
}

// The main score over the last days, drawn on top of the stress zones.
// history: [{ date, score }], score can be null (no data that day).
function RadarHistoryChart({ history }) {
  const [hoveredIndex, setHoveredIndex] = useState(null); // day under the mouse, or null
  const known = history.filter((point) => point.score !== null);

  if (known.length < 2) {
    return (
      <section className="history-chart">
        <p className="history-chart__empty">Not enough data yet.</p>
      </section>
    );
  }

  const step = PLOT_WIDTH / (history.length - 1);
  const xFor = (index) => PLOT_LEFT + index * step;

  // Summary numbers for the header
  const scores = known.map((point) => point.score);
  const high = Math.max(...scores);
  const low = Math.min(...scores);
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

  const periodChange = known.at(-1).score - known[0].score;
  const periodLabel = history.length <= 7 ? 'this week' : 'this month';

  const currentBand = getStressBand(known.at(-1).score);
  const daysInBand = known.filter(
    (point) => getStressBand(point.score).label === currentBand.label,
  ).length;

  // Which points get special markers
  const lastIndex = history.findLastIndex((point) => point.score !== null);
  const highIndex = history.findIndex((point) => point.score === high);
  const lowIndex = history.findIndex((point) => point.score === low);
  const showHighLow = high !== low;

  // The score line and the area under it
  const linePoints = history
    .map((point, index) => (point.score === null ? null : { x: xFor(index), y: yFor(point.score) }))
    .filter((point) => point !== null);
  const linePath = buildSmoothPath(linePoints);
  const hovered = hoveredIndex === null ? null : history[hoveredIndex];
  const hoveredX = hovered ? xFor(hoveredIndex) : null;
  // The previous day with data, for "change since previous day" in the tooltip
  const previous =
    hovered === null
      ? null
      : (history.slice(0, hoveredIndex).findLast((point) => point.score !== null) ?? null);
  const areaPath = `${linePath} L${linePoints.at(-1).x},${PLOT_BOTTOM} L${linePoints[0].x},${PLOT_BOTTOM} Z`;

  const axisValues = [0, ...STRESS_BANDS.map((band) => band.to)]; // 0, 25, 50, 75, 90, 100

  return (
    <section className="history-chart">
      <header className="history-chart__header">
        <div>
          <h2 className="history-chart__title">Market score · last 7 days</h2>
          <p className="history-chart__subtitle">
            <span style={{ color: currentBand.color }}>
              {daysInBand} of {known.length}
            </span>{' '}
            days in {currentBand.label}
          </p>
        </div>

        <div className="history-chart__stats">
          <span>
            Avg <strong>{average}</strong>
          </span>
          <span>
            High <strong>{high}</strong>
          </span>
          <span>
            Low <strong>{low}</strong>
          </span>
          <span
            className="history-chart__period-change"
            style={{ color: getChangeColor(periodChange) }}
          >
            {periodChange === 0 ? 'No change' : formatChange(periodChange)} {periodLabel}
          </span>
        </div>
      </header>
      <div className="history-chart__plot-area">
        <svg
          className="history-chart__svg"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label={`Market score over the last 7 days, now ${known.at(-1).score}`}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Line color depends on height: each zone's color sits in the middle of the zone,
                so the line blends smoothly from one zone color to the next. */}
            <linearGradient
              id="radar-line-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={PLOT_BOTTOM}
              x2="0"
              y2={PLOT_TOP}
            >
              {STRESS_BANDS.map((band) => (
                <stop
                  key={band.label}
                  offset={(band.from + band.to) / 2 / 100}
                  stopColor={band.color}
                />
              ))}
            </linearGradient>

            {/* Area under the line: current zone color, fading towards the bottom. */}
            <linearGradient
              id="radar-area-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={PLOT_TOP}
              x2="0"
              y2={PLOT_BOTTOM}
            >
              <stop offset="0" stopColor={currentBand.color} stopOpacity={FILL_TOP_OPACITY} />
              <stop offset="1" stopColor={currentBand.color} stopOpacity={FILL_BOTTOM_OPACITY} />
            </linearGradient>
          </defs>

          {/* 1. Zones: colored strip + name on the left, the current zone name is highlighted */}
          {STRESS_BANDS.map((band) => {
            const top = yFor(band.to);
            const bottom = yFor(band.from);
            const isCurrent = band.label === currentBand.label;

            return (
              <g key={band.label}>
                <rect
                  x={ZONE_BAR_X}
                  y={top + 2}
                  width="4"
                  height={bottom - top - 4}
                  fill={band.color}
                />
                <text
                  x={ZONE_LABEL_X}
                  y={(top + bottom) / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={
                    isCurrent
                      ? 'history-chart__zone history-chart__zone--current'
                      : 'history-chart__zone'
                  }
                  style={isCurrent ? { fill: band.color } : undefined}
                >
                  {band.label}
                </text>
              </g>
            );
          })}

          {/* 2. Grid lines and 0..100 numbers on the zone borders */}
          {axisValues.map((value) => (
            <g key={value}>
              <line
                x1={PLOT_LEFT}
                x2={PLOT_RIGHT}
                y1={yFor(value)}
                y2={yFor(value)}
                className="history-chart__grid"
              />
              <text
                x={AXIS_LABEL_X}
                y={yFor(value)}
                dominantBaseline="middle"
                className="history-chart__axis"
              >
                {value}
              </text>
            </g>
          ))}

          {/* 3. Hovered day: light column and a dashed vertical line, under the score line */}
          {hovered && (
            <>
              <rect
                x={hoveredX - step / 2}
                y={PLOT_TOP}
                width={step}
                height={PLOT_HEIGHT}
                className="history-chart__hover-column"
              />
              <line
                x1={hoveredX}
                x2={hoveredX}
                y1={PLOT_TOP}
                y2={PLOT_BOTTOM}
                className="history-chart__hover-line"
              />
            </>
          )}

          {/* 4. Area under the line, then the smooth score line; both dim while a day is hovered */}
          <g
            className={
              hovered ? 'history-chart__plot history-chart__plot--dimmed' : 'history-chart__plot'
            }
          >
            <path d={areaPath} fill="url(#radar-area-gradient)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#radar-line-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* 5. Points, High/Low marks, latest value and dates */}
          {history.map((point, index) => {
            if (point.score === null) {
              return null;
            }

            const x = xFor(index);
            const y = yFor(point.score);
            const isLast = index === lastIndex;
            const isHigh = showHighLow && index === highIndex && !isLast;
            const isLow = showHighLow && index === lowIndex && !isLast;

            return (
              <g key={point.date}>
                {isHigh || isLow ? (
                  <circle cx={x} cy={y} r="6" className="history-chart__marker" />
                ) : (
                  <>
                    {isLast && (
                      <circle
                        cx={x}
                        cy={y}
                        r="7"
                        fill={currentBand.color}
                        className="history-chart__pulse"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isLast ? 7 : 4}
                      fill={getStressBand(point.score).color}
                    />
                  </>
                )}

                {isHigh && (
                  <text x={x} y={y - 14} textAnchor="middle" className="history-chart__note">
                    High {high}
                  </text>
                )}
                {isLow && (
                  <text x={x} y={y + 24} textAnchor="middle" className="history-chart__note">
                    Low {low}
                  </text>
                )}
                {isLast && (
                  <text
                    x={x}
                    y={y - 14}
                    textAnchor="middle"
                    className="history-chart__latest"
                    style={{ fill: currentBand.color }}
                  >
                    {point.score}
                  </text>
                )}

                <text
                  x={x}
                  y={DATE_LABEL_Y}
                  textAnchor="middle"
                  className={[
                    'history-chart__date',
                    isLast && 'history-chart__date--today',
                    index === hoveredIndex && 'history-chart__date--active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isLast ? 'Today' : formatShortDate(point.date)}
                </text>
              </g>
            );
          })}

          {/* 6. Hovered day: a big point on the line */}
          {hovered && (
            <circle
              cx={hoveredX}
              cy={yFor(hovered.score)}
              r="7"
              fill={getStressBand(hovered.score).color}
              className="history-chart__hover-dot"
            />
          )}

          {/* 7. Invisible column around every day: hovering (or tapping) it selects that day */}
          {history.map(
            (point, index) =>
              point.score !== null && (
                <rect
                  key={point.date}
                  x={xFor(index) - step / 2}
                  y={PLOT_TOP}
                  width={step}
                  height={DATE_LABEL_Y - PLOT_TOP}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() => setHoveredIndex(index)}
                />
              ),
          )}
        </svg>

        {/* Day details, placed over the chart next to the hovered point */}
        {hovered && (
          <HistoryTooltip
            point={hovered}
            previous={previous}
            left={`${(hoveredX / VIEW_WIDTH) * 100}%`}
            top={`${(yFor(hovered.score) / VIEW_HEIGHT) * 100}%`}
            alignLeft={hoveredIndex > (history.length - 1) / 2}
          />
        )}
      </div>
    </section>
  );
}

export default RadarHistoryChart;
