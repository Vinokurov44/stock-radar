import { getSignalInfo } from '../utils/signalInfo.js';
import { getChangeColor } from '../utils/stressBands.js';
import { findMovers } from '../utils/movers.js';
import './TodayMovers.css';

const MAX_MOVERS = 3;

// Side column of the summary: which indicators moved the most since yesterday.
function TodayMovers({ history }) {
  const today = history.at(-1)?.components ?? [];
  const yesterday = history.at(-2)?.components ?? [];
  const movers = findMovers(today, yesterday).slice(0, MAX_MOVERS);

  return (
    <aside className="today-movers">
      <p className="today-movers__title">Biggest moves</p>

      {movers.length === 0 ? (
        <p className="today-movers__empty">No changes since yesterday.</p>
      ) : (
        <ul className="today-movers__list">
          {movers.map(({ signal, change }) => (
            <li key={signal} className="today-movers__item">
              <span>{getSignalInfo(signal).name}</span>
              <span className="today-movers__change" style={{ color: getChangeColor(change) }}>
                {change > 0 ? `▲ +${change}` : `▼ −${Math.abs(change)}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default TodayMovers;
