import Modal from './Modal.jsx';

// What Stock Radar is and how the score is calculated.
function AboutDialog({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} title="About Stock Radar" onClose={onClose}>
      <p className="modal__subtitle">
        Stock Radar combines six market stress indicators into one score from 0 (calm) to 100
        (crisis). Data is collected every hour.
      </p>

      <h3 className="modal__heading">How the score works</h3>
      <p>
        Each indicator gets its own score from 0 to 100. The main score is their weighted average:
        VIX 25%, Tension 25%, FSI 15%, Rate Shock 15%, CP Spread 10%, Crypto F&G 10%.
      </p>
      <p>
        When several indicators are stressed at the same time (score 50 or higher), the main score
        is boosted: ×1.2 for two, ×1.35 for three, ×1.5 for four or more, up to 100.
      </p>

      <h3 className="modal__heading">Who it's for</h3>
      <p>
        Stock Radar is for people who follow the stock market and like to look at the data behind
        it. Instead of checking six different sources every morning, you get one clear read on how
        stressed the markets are today, how it changed over the week, and which signals are driving
        it.
      </p>
      <p>
        It doesn't tell you what to buy or sell. It's a quick, honest snapshot to help you make your
        own decisions with more context.
      </p>

      <h3 className="modal__heading">Sources</h3>
      <p>
        Cboe, Office of Financial Research, Alternative.me, GDELT, U.S. Treasury, Federal Reserve
        via FRED.
      </p>

      <p className="modal__note">Not financial advice.</p>
    </Modal>
  );
}

export default AboutDialog;
