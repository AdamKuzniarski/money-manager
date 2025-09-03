export function toCurrencyEUR(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(num);
}

export function toDateDE(dateLike) {
  const date = new Date(dateLike);
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(date);
}
