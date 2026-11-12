// Score changes of each signal between two days, largest first: [{ signal, change }].
// today / yesterday: [{ signal, score }] — the `components` of two radar history points.
export function findMovers(today, yesterday) {
  const yesterdayScores = new Map(yesterday.map(({ signal, score }) => [signal, score]));

  return today
    .filter(({ signal }) => yesterdayScores.has(signal))
    .map(({ signal, score }) => ({ signal, change: score - yesterdayScores.get(signal) }))
    .filter(({ change }) => change !== 0)
    .toSorted((a, b) => Math.abs(b.change) - Math.abs(a.change));
}
