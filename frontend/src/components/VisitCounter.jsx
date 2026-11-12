import { useEffect, useState } from 'react';
import { fetchVisits, recordVisit } from '../api/visitsApi.js';
import './VisitCounter.css';

import { IconUsers } from '@tabler/icons-react';

const COUNTED_KEY = 'stock-radar-visit-counted'; // set once per browser tab

// Name of the current month, e.g. "November". UTC, like the counter on the server.
function getCurrentMonthName() {
  return new Date().toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
}

// "1,234 visits this month". A tab is counted once: refreshing it does not add a visit.
function VisitCounter() {
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(COUNTED_KEY) === 'yes';
      if (!alreadyCounted) {
        sessionStorage.setItem(COUNTED_KEY, 'yes'); // mark before the request -> no double count
      }
    } catch {
      // storage can be blocked (private mode) — then every load counts, that's fine
    }

    const request = alreadyCounted ? fetchVisits() : recordVisit();
    request
      .then((data) => setVisits(data.thisMonth))
      .catch(() => {
        // the counter is not important: if it fails, simply show nothing
      });
  }, []);

  if (visits === null) {
    return null;
  }

  return (
    <span className="visit-counter">
      <IconUsers size={22} stroke={1.5} />
      <span className="visit-counter__number">{visits.toLocaleString('en-US')}</span>
      {visits === 1 ? 'visit' : 'visits'} in {getCurrentMonthName()}
    </span>
  );
}

export default VisitCounter;
