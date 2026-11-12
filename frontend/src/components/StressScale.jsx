import { STRESS_BANDS, getStressBand } from '../utils/stressBands.js';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber.js';
import './StressScale.css';

// Horizontal scale of the stress zones with a marker at the current score.
function StressScale({ score }) {
  const shown = useAnimatedNumber(score); // moves from 0 to score when the page opens
  const activeLabel = getStressBand(shown).label;

  return (
    <div className="stress-scale">
      {STRESS_BANDS.map((band) => {
        const isActive = band.label === activeLabel;

        return (
          <div
            key={band.label}
            className={
              isActive ? 'stress-scale__band stress-scale__band--active' : 'stress-scale__band'
            }
            style={{ flexGrow: band.to - band.from }}
          >
            <span className="stress-scale__segment" style={{ backgroundColor: band.color }} />
            <span
              className="stress-scale__label"
              style={isActive ? { color: band.color } : undefined}
            >
              {band.label}
            </span>
          </div>
        );
      })}

      <span className="stress-scale__marker" style={{ left: `${shown}%` }} />
    </div>
  );
}

export default StressScale;
