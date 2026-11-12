export function scoreFromAnchors(value, anchors) {
  const first = anchors[0];
  const last = anchors.at(-1);

  if (value <= first.value) return first.score;
  if (value >= last.value) return last.score;

  for (let i = 1; i < anchors.length; i++) {
    const prev = anchors[i - 1];
    const next = anchors[i];

    if (value <= next.value) {
      const fraction = (value - prev.value) / (next.value - prev.value);
      return Math.round(prev.score + fraction * (next.score - prev.score));
    }
  }
}
