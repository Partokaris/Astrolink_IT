export function parsePrice(v) {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  // strip currency symbols and commas
  try {
    const cleaned = String(v).replace(/[^0-9.\-]/g, '');
    const n = parseFloat(cleaned);
    return isFinite(n) ? n : 0;
  } catch (e) {
    return 0;
  }
}

export function formatPrice(n) {
  const v = parsePrice(n);
  return v.toFixed(2);
}
