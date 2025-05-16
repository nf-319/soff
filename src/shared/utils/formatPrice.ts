export function formatPrice(value: number | string): string {
  const num = Number(value);

  if (isNaN(num)) return '-';

  if (num === 0) return '-';

  return `${num.toLocaleString('uz-UZ')} so'm`;
}
