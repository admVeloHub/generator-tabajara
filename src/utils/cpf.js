/** cpf.js v1.0.1 — simulação: aceita qualquer CPF informado (sem validação de dígitos) */
export function normalizeCpf(value) {
  return String(value || '').replace(/\D/g, '');
}

export function formatCpf(digits) {
  const d = normalizeCpf(digits);
  if (d.length !== 11) return d;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function generateRandomCpf() {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));
  const calc = (base) => {
    let sum = 0;
    for (let i = 0; i < base.length; i += 1) {
      sum += base[i] * (base.length + 1 - i);
    }
    let rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    return rest;
  };
  digits.push(calc(digits));
  digits.push(calc(digits));
  return digits.join('');
}
