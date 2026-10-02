import { rational, calculate, power, rationalText } from './rational.js';

const symbols = { add: '＋', sub: '−', mul: '×', div: '÷' };
const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const precedence = (node) => node.type === 'value' ? 5 : node.type === 'power' ? 4
  : node.type === 'negate' ? 3 : ['mul', 'div'].includes(node.type) ? 2 : 1;

export function evaluateExpression(node) {
  if (node.type === 'value') return rational(node.value.n, node.value.d);
  if (node.type === 'power') return power(evaluateExpression(node.base), node.exponent);
  if (node.type === 'negate') {
    const value = evaluateExpression(node.operand);
    return rational(-BigInt(value.n), value.d);
  }
  return calculate(evaluateExpression(node.left), node.type, evaluateExpression(node.right));
}

export function expressionTokens(node, root = true) {
  const group = (child) => [{ op: '(' }, ...expressionTokens(child, false), { op: ')' }];
  if (node.type === 'value') {
    const v = node.value;
    const tokens = v.d === '1' ? [{ n: v.n }] : [{ f: [v.n, v.d] }];
    return v.d === '1' ? tokens : [{ op: '(' }, ...tokens, { op: ')' }];
  }
  if (node.type === 'power') {
    const base = node.base;
    const needsGroup = base.type !== 'value' || BigInt(base.value.n) < 0n;
    // Fraction literals already carry parentheses; powers apply to the whole fraction.
    const tokens = base.type === 'value' && base.value.d !== '1' ? expressionTokens(base, false)
      : needsGroup ? group(base) : expressionTokens(base, false);
    return [...tokens, { n: String(node.exponent).split('').map(d => superscripts[Number(d)]).join('') }];
  }
  if (node.type === 'negate') {
    const child = node.operand;
    const needsGroup = precedence(child) < precedence(node)
      || (child.type === 'value' && child.value.d === '1' && BigInt(child.value.n) < 0n);
    return [{ op: '−' }, ...(needsGroup ? group(child) : expressionTokens(child, false))];
  }
  if (!symbols[node.type]) throw new RangeError(`Unknown expression operation: ${node.type}`);
  const childTokens = (child, right) => {
    const negativeInteger = child.type === 'value' && child.value.d === '1' && BigInt(child.value.n) < 0n;
    const needsGroup = precedence(child) < precedence(node)
      || (right && precedence(child) === precedence(node)) || negativeInteger || (right && child.type === 'negate');
    return needsGroup ? group(child) : expressionTokens(child, false);
  };
  return [...childTokens(node.left, false), { op: symbols[node.type], breakBefore: root }, ...childTokens(node.right, true)];
}

export function expressionText(node) {
  return expressionTokens(node).map(token => token.f
    ? rationalText({ n: token.f[0], d: token.f[1] }) : token.n ?? token.op).join('');
}
