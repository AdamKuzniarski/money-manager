import styled from "styled-components";
import useSWR from "swr";
import { STATE } from "@/constants/state";
import { useMemo, useState } from "react";
import AccountBalance from "@/components/AccountBalance";
import TransactionItem from "@/components/TransactionItem";
import Form from "@/components/TransactionForm";
import IncomeExpenseView from "@/components/IncomeExpenseView";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButtons from "@/components/AuthButtons";
import Pagination from "@/components/Pagination";
import FilterBar from "@/components/FilterBar";
import PieChartSection from "@/components/PieChartSection";
import { getFilteredTransactions, getTotals } from "@/lib/home-calcs";

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  //pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({ category: "", type: STATE.ALL });
  const [isChartOpen, setIsChartOpen] = useState(false);

  //Data
  const {
    data: transactions = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/transactions");
  const { data: categories = [] } = useSWR("/api/categories");

  // Helpers
  const filteredTransactions = getFilteredTransactions(transactions, filters);
  const {
    income: sumIncome,
    expense: sumExpense,
    balance: sumTotal,
  } = getTotals(filteredTransactions);

  const start = (currentPage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(
    start,
    start + pageSize
  );

  //Early returns
  if (error) return <div>failed to load</div>;
  if (isLoading) return <p>Loading...</p>;

  // Handler
  function handleToggleForm() {
    setIsFormOpen(!isFormOpen);
    if (isFormOpen) setEditingTransaction(null);
  }

  function handleCancelEdit() {
    setEditingTransaction(null);
    setIsFormOpen(false);
  }

  function toggleChart() {
    setIsChartOpen(!isChartOpen);
  }

  //Filter section
  function setFilterCategory(value) {
    setFilters((filter) => ({ ...filter, category: value }));
  }

  function setFilterType(value) {
    setFilters((filter) => ({ ...filter, type: value }));
  }
  function handleFilterClear() {
    setFilterCategory("");
  }

  //pagination and values
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

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

    response.json();
    await mutate();
  }

  async function handleUpdate(id, formData) {
    const response = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      console.error("Update Failed");
      return;
    }
    response.json();
    setEditingTransaction(null);
    setIsFormOpen(false);
    await mutate();
  }

  function handleEdit(transaction) {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  async function handleDelete(id) {
    const confirm = window.confirm(
      "Are you sure that you want to delete this transaction?"
    );

    if (!confirm) return;

    const response = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("Delete failed");
      return;
    }
    await mutate();
  }

  return (
    <>
      <ListBlock></ListBlock>

      <AuthButtons />
      <ThemeToggle />
      <AccountBalance transactions={transactions} />
      <main>
        <FilterBar
          value={filters.category}
          categories={categories}
          onChangeCategory={setFilterCategory}
          onClearCategory={handleFilterClear}
        />

        <ActiveFilterRow>
          <span>Active filter:</span>
          <ActiveBadge>{filters.category || "None"}</ActiveBadge>
        </ActiveFilterRow>

        <button type="button" onClick={toggleChart}>
          {isChartOpen ? "Hide Pie Chart" : "Show Pie Chart"}
        </button>
        <PieChartSection
          open={isChartOpen}
          transactions={filteredTransactions}
        />
      </main>
      <IncomeExpenseView
        filteredTransactions={filteredTransactions}
        sumIncome={sumIncome}
        sumExpense={sumExpense}
        sumTotal={sumTotal}
        filterType={filters.type}
        onFilter={setFilterType}
      />
      <ToggleButton onClick={handleToggleForm} disabled={!!editingTransaction}>
        {isFormOpen ? "Hide Form" : "Add new Transaction"}
      </ToggleButton>
      {isFormOpen && (
        <Form
          onSubmit={
            editingTransaction
              ? (data) => handleUpdate(editingTransaction._id, data)
              : handleSubmit
          }
          defaultValues={editingTransaction}
          onCancel={handleCancelEdit}
        />
      )}
      <TransactionsList>
        {filteredTransactions.length === 0 ? (
          <EmptyState>No Results available</EmptyState>
        ) : (
          paginatedTransactions.map((transaction) => (
            <TransactionItem
              onEdit={handleEdit}
              onDelete={handleDelete}
              transaction={transaction}
              key={transaction._id}
              onFilter={setFilterType}
            />
          ))
        )}

        {
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        }
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
  align-items: center;
`;

const ToggleButton = styled.button`
  display: block;
  margin: 15px 20px;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 2px solid ${({ disabled }) => (disabled ? "#ccc" : "#000")};
  background: ${({ disabled }) => (disabled ? "#f8f9fa" : "#000")};
  color: ${({ disabled }) => (disabled ? "#6c757d" : "#fff")};
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: all 0.2s ease;
`;

const ActiveFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 20px 10px;
  font-size: 0.95rem;
`;

const ActiveBadge = styled.span`
  padding: 0.1rem 0.5rem;
  border: 2px solid #000;
  border-radius: 999px;
  background: var(--background);
  color: var(--foreground);
`;

const EmptyState = styled.p`
  margin: 0.5rem 20px;
  opacity: 0.8;
`;

const ListBlock = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
`;
