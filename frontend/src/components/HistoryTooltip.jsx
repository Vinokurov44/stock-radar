import { getStressBand, getChangeColor } from '../utils/stressBands.js';
import { getSignalInfo } from '../utils/signalInfo.js';
import { formatLongDate } from '../utils/dates.js';
import { formatChange } from '../utils/changes.js';
import { findMovers } from '../utils/movers.js';
import './HistoryTooltip.css';

// Details of one day of the history chart: date, score, zone, change and the biggest mover.
// point / previous: radar history points { date, score, components }; previous can be null.
function HistoryTooltip({ point, previous, left, top, alignLeft }) {
  const band = getStressBand(point.score);
  const change = previous ? point.score - previous.score : null;
  const topMover = previous ? findMovers(point.components, previous.components)[0] : undefined;

  return (
    <div
      className={alignLeft ? 'history-tooltip history-tooltip--left' : 'history-tooltip'}
      style={{ left, top }}
    >
      <p className="history-tooltip__date">{formatLongDate(point.date)}</p>

      <p className="history-tooltip__main">
        <span className="history-tooltip__score">{point.score}</span>
        <span style={{ color: band.color }}>{band.label}</span>
        {change !== null && change !== 0 && (
          <span style={{ color: getChangeColor(change) }}>{formatChange(change)}</span>
        )}
      </p>

      {topMover && (
        <p className="history-tooltip__mover">
          Biggest mover:{' '}
          <strong>
            {getSignalInfo(topMover.signal).name} {formatChange(topMover.change)}
          </strong>
        </p>
      )}
    </div>
  );
}

export default HistoryTooltip;
