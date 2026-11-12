import './StatusPanel.css';

// Shown instead of the data while it is loading or when loading failed.
function StatusPanel({ status, onRetry }) {
  if (status === 'error') {
    return (
      <section className="status-panel">
        <h2 className="status-panel__title">Market data is temporarily unavailable</h2>
        <p className="status-panel__text">
          The server did not respond. Please try again in a minute.
        </p>
        <button type="button" className="status-panel__button" onClick={onRetry}>
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="status-panel">
      <h2 className="status-panel__title">Loading market data…</h2>
      <p className="status-panel__text">If the server was asleep, this can take up to a minute.</p>
    </section>
  );
}

export default StatusPanel;
