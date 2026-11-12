// Display info for each signal: names, explanation texts for the info popup,
// and an optional formatter for its value.
// zones: value ranges for Calm, Normal, Tense, Fear, Crisis (same order as STRESS_BANDS).
// weight: share in the main score — must match RADAR_WEIGHTS on the backend.
export const SIGNAL_INFO = {
  vix: {
    name: 'VIX',
    description: 'Expected stock swings',
    source: 'Cboe',
    updated: 'Daily, on US trading days',
    weight: 25,
    about:
      'The VIX shows how much the S&P 500 is expected to swing over the next 30 days, based on options prices. When investors rush to buy protection, it goes up. That is why it is often called the market\'s "fear gauge".',
    zones: ['below 15', '15 – 20', '20 – 30', '30 – 39', 'above 39'],
    context:
      'Its long-term average is around 19–20. It closed above 80 at the peaks of the 2008 crisis and in March 2020.',
    goodToKnow: 'It reacts fast and calms down fast. A spike can fade within a few days.',
    phrase: 'volatility',
  },

  fsi: {
    name: 'FSI',
    description: 'US financial stress',
    source: 'Office of Financial Research',
    updated: 'Daily, with a delay of about 2–3 business days',
    weight: 15,
    about:
      'The OFR Financial Stress Index combines 33 market measures in five groups: credit, stock valuations, funding, safe assets and volatility. Zero means average stress: above zero is more stress than usual, below zero is less.',
    zones: ['below −2', '−2 – 0', '0 – 5', '5 – 9.2', 'above 9.2'],
    context: 'It rose above 10 in March 2020 and went even higher during the 2008 crisis.',
    goodToKnow:
      'It is the broadest signal here, but also the slowest: new values arrive a few days late. It already includes volatility, so it partly overlaps with the VIX.',
    phrase: 'financial stress',
  },

  fng: {
    name: 'Crypto F&G',
    description: 'Crypto fear & greed',
    source: 'Alternative.me',
    updated: 'Daily',
    weight: 10,
    formatValue: (value) => `${value}`,
    about:
      "A daily sentiment index for Bitcoin. It combines Bitcoin's volatility, trading volume and momentum, social media activity, Bitcoin's share of the crypto market and Google search trends into one number from 0 (extreme fear) to 100 (extreme greed).",
    zones: ['75 – 100', '50 – 75', '25 – 50', '10 – 25', 'below 10'],
    zonesNote: 'This scale is reversed: a high value means greed, which is low stress.',
    goodToKnow:
      'It measures the crypto market only, so it has the smallest weight in the main score.',
    phrase: 'crypto sentiment',
  },

  world_tension: {
    name: 'Tension',
    description: 'Geopolitical news',
    source: 'GDELT',
    updated: 'Every hour',
    weight: 25,
    about:
      'Built by Stock Radar from GDELT, a global database of news events. Every 15 minutes we read new events between key countries — the US, Europe, China, Russia, the Middle East and others — and keep international and government or military actions. Each event gets a conflict strength, and the value is the average strength per news mention.',
    zones: ['below 1.4', '1.4 – 1.8', '1.8 – 2.25', '2.25 – 2.7', 'above 2.7'],
    context:
      'Calm years like 2018–2019 were around 1.4–1.7. The outbreaks of major conflicts in 2022–2026 reached 2.3–2.8.',
    goodToKnow:
      "It measures how harsh the news is, not how much news there is. Real actions weigh more than threats. Today's value covers the last 24 hours.",
    phrase: 'world tension',
  },

  rate_shock: {
    name: 'Rate Shock',
    description: '10Y Treasury, 20-day move',
    source: 'U.S. Treasury',
    updated: 'Daily, on US trading days',
    weight: 15,
    unit: 'bp',
    formatValue: (value) => (value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : '0'),
    about:
      'How much the 10-year US Treasury yield changed over the last 20 trading days, in basis points (1 bp = 0.01%). Mortgages, company loans and stock valuations follow this rate, so a sharp move in either direction reprices them fast.',
    zones: ['below 15', '15 – 30', '30 – 50', '50 – 75', 'above 75'],
    zonesNote:
      'The size of the move counts, not its direction: a fall of 40 bp is as stressful as a rise of 40 bp.',
    context:
      'A typical day since 2000 shows about 16 bp. During the 2022 rate hikes it was often 30–60 bp. In March 2020 the yield fell by more than 100 bp.',
    goodToKnow: 'A 20-day window can miss a quick spike that reverses within a few days.',
    phrase: 'bond yield swings',
  },

  cp_spread: {
    name: 'CP Spread',
    description: 'Corporate funding stress',
    source: 'Federal Reserve via FRED',
    updated: 'Daily, with a delay of one business day',
    weight: 10,
    unit: 'bp',
    formatValue: (value) => `${value}`,
    about:
      'The extra interest that lower-rated companies (A2/P2) pay compared with top-rated companies (AA) to borrow for 30 days through commercial paper. When lenders get scared, they ask much more from weaker borrowers, and the gap grows. The value is a 3-day average.',
    zones: ['below 22', '22 – 35', '35 – 50', '50 – 70', 'above 70'],
    context:
      'In the calm years 2017–2019 it was around 29 bp. It reached about 96 bp during the banking stress of March 2023, close to 200 bp in March 2020, and above 500 bp in 2008.',
    goodToKnow:
      'It stays quiet most of the time and wakes up only when companies really struggle to borrow. Stock market scares alone often do not move it.',
    phrase: 'short-term credit',
  },
};

// Info for a signal; unknown signals get their own name in upper case.
export function getSignalInfo(signal) {
  return SIGNAL_INFO[signal] ?? { name: signal.toUpperCase(), description: '' };
}

// Signal value as text: uses the signal's own formatter if it has one.
export function formatSignalValue(info, value) {
  return info.formatValue ? info.formatValue(value) : value.toFixed(2);
}
