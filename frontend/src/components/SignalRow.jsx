import { getStressBand } from '../utils/stressBands.js';
import { getSignalInfo, formatSignalValue } from '../utils/signalInfo.js';
import './SignalRow.css';
import { IconInfoCircle } from '@tabler/icons-react';
import Sparkline from './Sparkline.jsx';
import { formatShortDate } from '../utils/dates.js';

// One indicator: name, score with a bar, status, latest value.
function SignalRow({ snapshot, onInfo }) {
  const { signal, date, value, score } = snapshot;
  const info = getSignalInfo(signal);
  const band = getStressBand(score);

  return (
    <tr>
      <td>
        <div className="signal-row__name">
          {info.name}
          <button
            type="button"
            className="signal-row__info"
            onClick={() => onInfo(signal)}
            aria-label={`About ${info.name}`}
          >
            <IconInfoCircle size={18} stroke={1.5} />
          </button>
        </div>
        <div className="signal-row__description">{info.description}</div>
      </td>

      <td>
        <div className="signal-row__score">
          <span className="signal-row__score-value">{score}</span>
          <div className="signal-row__bar">
            <div
              className="signal-row__bar-fill"
              style={{ width: `${score}%`, backgroundColor: band.color }}
            />
          </div>
        </div>
      </td>

      <td>
        <span className="signal-row__status" style={{ color: band.color }}>
          <span className="signal-row__dot" />
          {band.label}
        </span>
      </td>

      <td>
        <div className="signal-row__value">
          {formatSignalValue(info, value)}
          {info.unit && <span className="signal-row__unit">{info.unit}</span>}
        </div>
        <div className="signal-row__date">{formatShortDate(date)}</div>
      </td>

      <td className="signal-row__chart">
        <Sparkline points={snapshot.history ?? []} color={band.color} />
      </td>
    </tr>
  );
}

export default SignalRow;
