import { parseTenYearYields, getRecentTenYearYields } from '../src/clients/treasuryClient.js';

const sample = `Date,"1 Mo","10 Yr"
10/16/2026,4.12,5.09
10/15/2026,4.17,5.10`;

console.log(await getRecentTenYearYields(5));
