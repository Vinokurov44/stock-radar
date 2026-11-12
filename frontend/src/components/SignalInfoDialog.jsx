import Modal from './Modal.jsx';
import { getSignalInfo } from '../utils/signalInfo.js';
import { STRESS_BANDS } from '../utils/stressBands.js';
import './SignalInfoDialog.css';

// Explanation of one indicator. Open when `signal` is set.
function SignalInfoDialog({ signal, onClose }) {
  const info = signal ? getSignalInfo(signal) : null;

  return (
    <Modal isOpen={signal !== null} title={info?.name} onClose={onClose}>
      {info && (
        <>
          <p className="modal__subtitle">{info.description}</p>

          <h3 className="modal__heading">What it measures</h3>
          <p>{info.about}</p>

          {info.zones && (
            <>
              <h3 className="modal__heading">How to read it</h3>
              <ul className="signal-zones">
                {STRESS_BANDS.map((band, index) => (
                  <li key={band.label} className="signal-zones__row">
                    <span className="signal-zones__name">
                      <span className="signal-zones__dot" style={{ backgroundColor: band.color }} />
                      {band.label}
                    </span>
                    <span className="signal-zones__range">
                      {info.zones[index]}
                      {info.unit && ` ${info.unit}`}
                    </span>
                  </li>
                ))}
              </ul>
              {info.zonesNote && <p className="signal-zones__note">{info.zonesNote}</p>}
            </>
          )}

          {info.context && (
            <>
              <h3 className="modal__heading">For context</h3>
              <p>{info.context}</p>
            </>
          )}

          {info.goodToKnow && (
            <>
              <h3 className="modal__heading">Good to know</h3>
              <p>{info.goodToKnow}</p>
            </>
          )}

          <p className="modal__note">
            Source: {info.source}
            {info.updated && ` · ${info.updated}`}
            {info.weight && ` · Weight in the main score: ${info.weight}%`}
          </p>
        </>
      )}
    </Modal>
  );
}

export default SignalInfoDialog;
