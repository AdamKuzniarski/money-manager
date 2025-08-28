import React, { useState } from "react";
import { STATE } from "@/constants/state";

export default function IncomeExpenseView({
  transactions,
  incomeTotal,
  expenseTotal,
  balanceTotal,
  onFilter,
}) {
  const [filterType, setFilterType] = useState(STATE.ALL);
  // const [formData, setFormData] = useState({
  //   description: "",
  //   amount: "",
  //   type: STATE.INCOME,
  // });

  //Change radio button
  function handleFilterType(event) {
    const filterValue = event.target.value;
    setFilterType(filterValue);
    if (onFilter) {
      onFilter(filterValue);
    }
  }

  //filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    return filterType === STATE.ALL || transaction.type === filterType;
  });

  //compute sum income and expense
  const sumIncome = filteredTransactions
    .filter(function (transaction) {
      return transaction.type === STATE.INCOME;
    })
    .reduce(function (total, transaction) {
      return total + Number(transaction.amount);
    }, 0);

  const sumExpense = filteredTransactions
    .filter(function (transaction) {
      return transaction.type === STATE.EXPENSE;
    })
    .reduce(function (total, transaction) {
      return total + Number(transaction.amount);
    }, 0);

  let totalLabel = "";
  if (filterType === STATE.INCOME) {
    totalLabel = `Total Income: €${sumIncome}`;
  } else if (filterType === STATE.EXPENSE) {
    totalLabel = `Total Expense: €${sumExpense}`;
  } else {
    totalLabel = `Total Balance: €${sumIncome - sumExpense}`;
  }

  function formatLabel(key) {
    return key.charAt(0) + key.slice(1).toLowerCase();
  }

  return (
    <div>
      <form>
        {Object.entries(STATE).map(function ([key, value]) {
          return (
            <label key={key} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="state"
                value={value}
                checked={filterType === value}
                onChange={handleFilterType}
              />
              {formatLabel(key)}
            </label>
          );
        })}
        <p>{totalLabel}</p>
      </form>
    </div>
  );
}
