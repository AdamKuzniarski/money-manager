import useSWR from "swr";
import { useState } from "react";
import styled from "styled-components";
import AccountBalance from "@/components/AccountBalance";
import TransactionItem from "@/components/TransactionItem";
import IncomeExpenseView from "@/components/IncomeExpenseView";
import Form from "@/components/CreateTransaction";
import { STATE } from "@/constants/state";

export default function HomePage() {
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filterType, setFilterType] = useState(STATE.ALL);

  function handleToggle() {
    setIsFormVisible(!isFormVisible);
  }

  const {
    data: transactions,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/transactions");

  if (error) return <div>failed to load</div>;
  if (isLoading) return <p>is Loading...</p>;

  async function handleSubmit(formData) {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      console.error("POST failed");
      return;
    }

    await response.json();
    await mutate();
  }

  //filter transactions for rendering
  const filteredTransactions = transactions.filter(
    (transaction) => filterType === STATE.ALL || transaction.type === filterType
  );

  return (
    <>
      <AccountBalance transactions={transactions} />
      <ToggleButton onClick={handleToggle}>
        {isFormVisible ? `Hide Form` : "Show Form"}
      </ToggleButton>
      {isFormVisible && (
        <Form onSubmit={handleSubmit} transactions={transactions} />
      )}
      <IncomeExpenseView
        transactions={transactions}
        onFilter={setFilterType}
      ></IncomeExpenseView>
      <TransactionsList>
        {filteredTransactions.map((transaction) => (
          <TransactionItem transaction={transaction} key={transaction._id} />
        ))}
      </TransactionsList>
    </>
  );
}

const TransactionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ToggleButton = styled.button`
  display: block;
  margin-left: auto;
  margin-right: 20px;
  margin-bottom: 10px;
`;
