import { parseObservations } from '../src/clients/fredClient.js';

const sample = {
  observations: [
    { date: '2026-10-13', value: '4.16' },
    { date: '2026-10-12', value: '.' },
    { date: '2026-10-09', value: '4.12' },
  ],
};
console.log(parseObservations(sample));
