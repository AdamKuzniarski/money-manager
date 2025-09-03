import { STATE } from "@/constants/state";

export function getFilteredTransactions(transactions, filters) {
  return transactions.filter((transaction) => {
    // Kategorie-Filter prüfen
    const matchesCategory =
      !filters.category || transaction.category === filters.category;

    // Typ-Filter prüfen (ALL, INCOME, EXPENSE)
    const matchesType =
      filters.type === STATE.ALL ||
      (filters.type === STATE.INCOME && transaction.type === "income") ||
      (filters.type === STATE.EXPENSE && transaction.type === "expense");

    // Transaktion nur behalten, wenn BEIDE Filter passen
    return matchesCategory && matchesType;
  });
}

export function getTotals(transactions) {
  let income = 0;
  let expense = 0;

  for (let transaction of transactions) {
    const amount = Number(transaction?.amount);
    if (transaction?.type === "income") income += amount;
    else if (transaction?.type === "expense") expense += amount;
  }
  return {
    income,
    expense,
    balance: income - expense,
  };
}
