import styled from "styled-components";
import { STATE } from "@/constants/state";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import AccountBalance from "@/components/AccountBalance";
import TransactionItem from "@/components/TransactionItem";
import Form from "@/components/TransactionForm";
import IncomeExpenseView from "@/components/IncomeExpenseView";
import ThemeToggle from "@/components/ThemeToggle";
import CategoryPieChart from "@/components/CategoryPieChart";
import AuthButtons from "@/components/AuthButtons";
import useSWR from "swr";
import Pagination from "@/components/Pagination";

export default function HomePage() {
  // session
  const { data: session, status } = useSession();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState(STATE.ALL);
  const [isChartVisible, setIsChartVisible] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  const {
    data: transactions = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/transactions");
  const { data: categories = [] } = useSWR("/api/categories");

  
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (filterCategory) {
      result = result.filter(
        (transaction) => transaction.category === filterCategory
      );
    }

    if (filterType !== STATE.ALL) {
      result = result.filter((transaction) => transaction.type === filterType);
    }
    return result;
  }, [transactions, filterCategory, filterType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // calculations
  const sumIncome = filteredTransactions
    .filter((transaction) => transaction.type === STATE.INCOME)
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  const sumExpense = filteredTransactions
    .filter((transaction) => transaction.type === STATE.EXPENSE)
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  const sumTotal = sumIncome - sumExpense;

  let filterBalance = 0;
  for (const transaction of filteredTransactions) {
    const amount = Number(transaction.amount) || 0;
    filterBalance += amount;
  }

  // early returns 
  if (error) return <div>failed to load</div>;
  if (isLoading) return <p>Loading...</p>;

  // handlers 
  function handleToggle() {
    setIsFormVisible(!isFormVisible);
    if (isFormVisible) setEditingTransaction(null);
  }

  function handleCancel() {
    setEditingTransaction(null);
    setIsFormVisible(false);
  }

  function handleFilterCategoryChange(event) {
    setFilterCategory(event.target.value);
    setCurrentPage(1);
  }

  function handleClearFilter() {
    setFilterCategory("");
    setCurrentPage(1);
  }

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
    await response.json();
    setEditingTransaction(null);
    setIsFormVisible(false);
    await mutate();
  }

  function handleEdit(transaction) {
    setEditingTransaction(transaction);
    setIsFormVisible(true);
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure that you want to delete this transaction?"
    );
    if (!confirmDelete) return;

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
      <ListBlock>
        <AuthButtons />
        <ThemeToggle />
        <AccountBalance transactions={transactions} />
        {filteredTransactions.length}{" "}
        {filteredTransactions.length === 1 ? "Result" : "Results"}, Balance:{" "}
        <BalanceAmount $isPositive={filterBalance >= 0}>
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(filterBalance)}
        </BalanceAmount>
        <FilterBar onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="filterCategory">Filter by category:</label>
          <select
            id="filterCategory"
            name="filterCategory"
            value={filterCategory}
            onChange={handleFilterCategoryChange}
          >
            <option value="">Please select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <ClearButton
            type="button"
            onClick={handleClearFilter}
            disabled={!filterCategory}
            aria-disabled={!filterCategory}
          >
            Clear Filter
          </ClearButton>
        </FilterBar>
        <ActiveFilterRow>
          <span>Active filter:</span>
          <ActiveBadge>{filterCategory || "None"}</ActiveBadge>
        </ActiveFilterRow>
        <IncomeExpenseView
          filteredTransactions={filteredTransactions}
          sumIncome={sumIncome}
          sumExpense={sumExpense}
          sumTotal={sumTotal}
          onFilter={setFilterType}
        />
        <ToggleButton onClick={handleToggle} disabled={!!editingTransaction}>
          {isFormVisible ? `Hide Form` : "Show Form"}
        </ToggleButton>
        {isFormVisible && (
          <Form
            onSubmit={
              editingTransaction
                ? (data) => handleUpdate(editingTransaction._id, data)
                : handleSubmit
            }
            defaultValues={editingTransaction}
            transactions={transactions}
            onCancel={handleCancel}
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
        </TransactionsList>
        {filteredTransactions.length > 0 && (
          <PaginationContainer>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </PaginationContainer>
        )}
        <section>
          <ToggleButton
            type="button"
            onClick={() => setIsChartVisible(!isChartVisible)}
          >
            {isChartVisible ? "Hide Pie Chart" : "Show Pie Chart"}
          </ToggleButton>
          <CollapsedPieChart $open={isChartVisible}>
            <CategoryPieChart transactions={transactions} />
          </CollapsedPieChart>
        </section>
      </ListBlock>
    </>
  );
}

/* styles */
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

const CollapsedPieChart = styled.div`
  margin-top: 12px;
  display: ${({ $open }) => ($open ? "block" : "none")};
`;

const FilterBar = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 20px 10px;
`;

const ClearButton = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 2px solid #000;
  background: transparent;
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
  background: #fff;
`;

const EmptyState = styled.p`
  margin: 0.5rem 20px;
  opacity: 0.8;
`;

const BalanceAmount = styled.span`
  color: ${({ $isPositive }) => ($isPositive ? "#22c55e" : "#ef4444")};
  font-weight: bold;
`;

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const ListBlock = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
`;
