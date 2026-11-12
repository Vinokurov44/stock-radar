import { useEffect, useState } from 'react';
import { fetchRadar } from '../api/radarApi.js';
import { fetchSignals } from '../api/signalsApi.js';
import AppHeader from '../components/AppHeader.jsx';
import RadarSummary from '../components/RadarSummary.jsx';
import SignalsTable from '../components/SignalsTable.jsx';
import RadarHistoryChart from '../components/RadarHistoryChart.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import AppFooter from '../components/AppFooter.jsx';
import './RadarPage.css';

// The only page of the app: loads all data and passes it down to the blocks.
// The header is always visible; while data is missing a status panel takes its place.
function RadarPage() {
  const [status, setStatus] = useState('loading');
  const [radar, setRadar] = useState(null);
  const [signals, setSignals] = useState([]);
  const [attempt, setAttempt] = useState(0); // grows on Retry -> data loads again

  useEffect(() => {
    Promise.all([fetchRadar(), fetchSignals()])
      .then(([radarData, signalsData]) => {
        setRadar(radarData);
        setSignals(signalsData);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, [attempt]);

  function handleRetry() {
    setStatus('loading');
    setAttempt((count) => count + 1);
  }

  return (
    <main className="radar-page">
      <div className="radar-page__frame">
        <AppHeader updatedAt={radar?.updatedAt} />
        {status === 'ok' ? (
          <RadarSummary radar={radar} signals={signals} />
        ) : (
          <StatusPanel status={status} onRetry={handleRetry} />
        )}
      </div>

      {status === 'ok' && (
        <>
          <SignalsTable signals={signals} />
          <RadarHistoryChart history={radar.history} />
        </>
      )}
      <AppFooter />
    </main>
  );
}

export default RadarPage;
