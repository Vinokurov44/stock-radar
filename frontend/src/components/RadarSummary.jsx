import Gauge from './Gauge.jsx';
import StressScale from './StressScale.jsx';
import TodayMovers from './TodayMovers.jsx';
import Sparkline from './Sparkline.jsx';
import { getStressBand, getChangeColor } from '../utils/stressBands.js';
import { getSignalInfo } from '../utils/signalInfo.js';
import { formatChange } from '../utils/changes.js';
import './RadarSummary.css';

// One human sentence for each stress zone.
const HEADLINES = {
  Calm: 'Markets are calm',
  Normal: 'Markets are mostly calm',
  Tense: 'Markets are tense',
  Fear: 'Markets are fearful',
  Crisis: 'Markets are in crisis',
};

// Signals with a score, the most stressed first.
function sortByStress(signals) {
  return signals
    .filter((signal) => typeof signal.score === 'number')
    .toSorted((a, b) => b.score - a.score);
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}

// "Volatility and crypto sentiment are the main sources of stress today."
function buildStressSentence(sources) {
  if (sources.length < 2) {
    return null;
  }
  const first = getSignalInfo(sources[0].signal).phrase;
  const second = getSignalInfo(sources[1].signal).phrase;
  return `${capitalize(first)} and ${second} are the main sources of stress today.`;
}

// Main block of the page: the overall stress score and what drives it.
function RadarSummary({ radar, signals }) {
  const score = radar.latest.score;
  const band = getStressBand(score);

  const yesterdayScore = radar.history.at(-2)?.score;
  const hasYesterday = typeof yesterdayScore === 'number';
  const yesterdayBand = hasYesterday ? getStressBand(yesterdayScore) : null;
  const zoneChanged = hasYesterday && yesterdayBand.label !== band.label;
  const dailyChange = hasYesterday ? score - yesterdayScore : null;

  const sources = sortByStress(signals);
  const sentence = buildStressSentence(sources);
  const topSource = sources[0];

  return (
    <section className="radar-summary">
      <div className="summary-card radar-summary__score">
        <p className="summary-card__eyebrow">Market stress score</p>
        <div className="radar-summary__gauge">
          <Gauge score={score} />
        </div>
        <StressScale score={score} />
      </div>

      <div className="summary-card radar-summary__headline-card">
        <div className="radar-summary__badge-row">
          <span className="radar-summary__badge" style={{ '--band-color': band.color }}>
            {band.label}
          </span>
          {zoneChanged && (
            <span className="radar-summary__zone-change">
              Moved from {yesterdayBand.label} to {band.label} today
            </span>
          )}
        </div>
        <h1 className="radar-summary__headline">{HEADLINES[band.label]}</h1>
        {sentence && <p className="radar-summary__sentence">{sentence}</p>}
      </div>

      <div className="summary-card radar-summary__change-card">
        <p className="summary-card__eyebrow">Since yesterday</p>
        {hasYesterday ? (
          <div className="radar-summary__change-row">
            <p className="radar-summary__change" style={{ color: getChangeColor(dailyChange) }}>
              {formatChange(dailyChange)}
            </p>
            <p className="radar-summary__change-detail">
              {yesterdayScore} → {score}
            </p>
          </div>
        ) : (
          <p className="radar-summary__change-detail">No data for yesterday</p>
        )}
      </div>

      <div className="summary-card radar-summary__movers-card">
        <TodayMovers history={radar.history} />
      </div>

      {topSource && <TopStressSource source={topSource} />}
    </section>
  );
}

// The signal with the highest score right now, with its last days as a small line.
function TopStressSource({ source }) {
  const info = getSignalInfo(source.signal);
  const sourceBand = getStressBand(source.score);

  return (
    <div className="summary-card radar-summary__source-card">
      <div>
        <p className="summary-card__eyebrow">Top stress source</p>
        <p className="radar-summary__source-name">{info.name}</p>
      </div>

      <div className="radar-summary__source-chart">
        <Sparkline points={source.history ?? []} color={sourceBand.color} stretch />
      </div>

      <p className="radar-summary__source-score">
        {source.score}
        <span className="radar-summary__source-band" style={{ color: sourceBand.color }}>
          ● {sourceBand.label}
        </span>
      </p>
    </div>
  );
}

export default RadarSummary;
