import { useState } from 'react';
import SignalRow from './SignalRow.jsx';
import SignalInfoDialog from './SignalInfoDialog.jsx';
import './SignalsTable.css';

// All indicators as a table: one row per signal, plus one info popup.
function SignalsTable({ signals }) {
  const [selectedSignal, setSelectedSignal] = useState(null);

  return (
    <section className="signals-table">
      <table>
        <thead>
          <tr>
            <th>Indicator</th>
            <th>Score</th>
            <th>Status</th>
            <th>Value</th>
            <th>7 days</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((snapshot) => (
            <SignalRow key={snapshot._id} snapshot={snapshot} onInfo={setSelectedSignal} />
          ))}
        </tbody>
      </table>

      <SignalInfoDialog signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
    </section>
  );
}

export default SignalsTable;
