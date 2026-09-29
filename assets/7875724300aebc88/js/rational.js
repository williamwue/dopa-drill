// JSON-safe exact rational values. No binary floating-point arithmetic.
const gcd = (a, b) => b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
export function rational(n, d = 1) {
  if ([n, d].some(v => typeof v === 'number' && !Number.isSafeInteger(v))) throw new RangeError('Use integer strings for large rational values');
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) throw new RangeError('Zero denominator');
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: String(n / g), d: String(d / g) };
}
export function calculate(a, op, b) {
  const n = BigInt(a.n), d = BigInt(a.d), m = BigInt(b.n), e = BigInt(b.d);
  if (op === 'add') return rational(n * e + m * d, d * e);
  if (op === 'sub') return rational(n * e - m * d, d * e);
  if (op === 'mul') return rational(n * m, d * e);
  if (op === 'div') return rational(n * e, d * m);
  throw new RangeError(`Unknown rational operation: ${op}`);
}
export const rationalText = ({ n, d }) => d === '1' ? n : `${n}/${d}`;
