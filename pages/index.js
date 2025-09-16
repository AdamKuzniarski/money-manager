import styled from "styled-components";
import useSWR from "swr";
import { STATE } from "@/constants/state";
import { useState } from "react";
import AccountBalance from "@/components/AccountBalance";
import TransactionItem from "@/components/TransactionItem";
import IncomeExpenseView from "@/components/IncomeExpenseView";
import Pagination from "@/components/Pagination";
import FilterBar from "@/components/FilterBar";
import { getFilteredTransactions, getTotals } from "@/lib/home-calcs";
import ImportExportDataInCsv from "@/components/ImportExportDataInCsv";
import { Card } from "@/components/ui/Primitives";
import AuthButtons from "@/components/AuthButtons";
import TransactionForm from "@/components/TransactionForm.js";
import { toast } from "react-toastify";
import { notify } from "@/lib/toast";
import { toCurrencyEUR } from "@/lib/format";
import FilteredBalance from "@/components/FilteredBalance";
import moment from "moment";
import { PRESETS } from "@/constants/presets";

export default function HomePage() {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  //pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState({
    category: "",
    type: STATE.ALL,
    dateFrom: "",
    dateTo: "",
    timePreset: "all",
  });

  //Data
  const {
    data: transactions = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/transactions");
  const { data: categories = [] } = useSWR("/api/categories");

  //Early returns
  if (isLoading)
    return (
      <Status role="status" aria-live="polite">
        Loading...
      </Status>
    );

  if (error)
    return (
      <Status role="status" aria-live="polite">
        failed to load
      </Status>
    );

  // Helpers
  const filteredTransactions = getFilteredTransactions(transactions, filters);
  const {
    income: sumIncome,
    expense: sumExpense,
    balance: sumTotal,
  } = getTotals(filteredTransactions);

  const isFiltered =
    Boolean(filters.category) ||
    filters.type !== STATE.ALL ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo);

  const start = (currentPage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(
    start,
    start + pageSize
  );

  // Handler
  function handleCancelEdit() {
    setEditingTransaction(null);
    setIsFormOpen(false);
  }

  //Filter section
  function setFilterCategory(value) {
    setFilters((filter) => ({ ...filter, category: value }));
    setCurrentPage(1);
  }

  function setFilterType(value) {
    setFilters((filter) => ({ ...filter, type: value }));
    setCurrentPage(1);
  }

  function setFilterDates({ dateFrom, dateTo }) {
    setFilters((filter) => ({
      ...filter,
      dateFrom: dateFrom ?? filter.dateFrom,
      dateTo: dateTo ?? filter.dateTo,
      timePreset: "custom",
    }));
    setCurrentPage(1);
  }

  function getRangeByPreset(preset) {
    const rangeEnd = moment().format("YYYY-MM-DD");

    if (preset === PRESETS.TODAY) {
      rangeStart = rangeEnd;
      return [rangeStart, rangeEnd];
    }

    if (preset === PRESETS.LAST7DAYS) {
      const rangeStart = moment().day(-7).format("YYYY-MM-DD");
      return [rangeStart, rangeEnd];
    }

    if (preset === PRESETS.LAST30DAYS) {
      const rangeStart = moment().day(-30).format("YYYY-MM-DD");
      return [rangeStart, rangeEnd];
    }

    if (preset === PRESETS.MONTH) {
      const rangeStart = moment().startOf("month").format("YYYY-MM-DD");
      return [rangeStart, rangeEnd];
    }

    // Default case for "ALL"
    return ["", ""];
  }

  function handleDatePreset(preset) {
    const [rangeStart, rangeEnd] = getRangeByPreset(preset);

    setFilters({
      ...filters,
      dateFrom: rangeStart,
      dateTo: rangeEnd,
      timePreset: preset,
    });
    setCurrentPage(1);
  }

  //pagination and values
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );

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
    setIsFormOpen(false);
    await mutate();
    notify.saved();
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
      toast.error();
      return;
    }
    await mutate();
    notify.deleted();
  }

  return (
    <Main aria-label="Finance dashboard" data-tour="introApp">
      <CardControls>
        <AuthButtons />
      </CardControls>
      <Card data-tour="balance-summary">
        <TourFocus data-tour-target="inner">
          <AccountBalance transactions={transactions} />
        </TourFocus>
        {isFiltered && <FilteredBalance value={sumTotal} />}
      </Card>
      <CardFilter>
        <FilterBar
          value={filters.category}
          categories={categories}
          onChangeCategory={setFilterCategory}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          preset={filters.timePreset}
          onChangeDates={setFilterDates}
          onPreset={handleDatePreset}
        />

        <IncomeExpenseView
          filteredTransactions={filteredTransactions}
          sumIncome={sumIncome}
          sumExpense={sumExpense}
          sumTotal={sumTotal}
          filterType={filters.type}
          onFilter={setFilterType}
        />
      </CardFilter>

      <TransactionsList
        aria-labelledby="transactions-title"
        data-tour="transactions-list"
      >
        <ScreenReaderH2 id="transactions-title">Transactions</ScreenReaderH2>
        {filteredTransactions.length === 0 ? (
          <EmptyState>No Results Available</EmptyState>
        ) : (
          paginatedTransactions.map((transaction) => (
            <TransactionsListItem
              key={transaction._id}
              aria-label={`${transaction.name ?? "unknown"}:${
                transaction.amount
              }€ ${transaction.date}`}
            >
              <TransactionItem
                onEdit={handleEdit}
                onDelete={handleDelete}
                transaction={transaction}
                onFilter={setFilterType}
              />
              {isFormOpen && editingTransaction?._id === transaction._id && (
                <InlineEdit>
                  <TransactionForm
                    key={`edit-${transaction._id}`}
                    defaultValues={editingTransaction}
                    onSubmit={(data) => handleUpdate(transaction._id, data)}
                    onCancel={handleCancelEdit}
                  />
                </InlineEdit>
              )}
            </TransactionsListItem>
          ))
        )}
        <ImportExportDataInCsv
          transactions={filteredTransactions} //parent (homepage)gibt die aktuell sichtbare sätze an child iecsv
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          filteredTransactions={filteredTransactions}
        />
      </TransactionsList>
      <ImportExportDataInCsv />
    </Main>
  );
}

const TransactionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: stretch;
  max-width: 480px;
  margin-inline: auto;
`;

const EmptyState = styled.p`
  margin: 0.5rem 12px;
  opacity: 0.8;
  text-align: center;
`;

const CardControls = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardFilter = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 12px;
  margin-bottom: 10px;
`;

const InlineEdit = styled.div`
  margin: 6px 0 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  padding: 8px 0;
`;

/* a11y */

const Main = styled.main`
  display: block;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
`;

const Status = styled.p`
  margin: 16px 20px;
`;

const TransactionsListItem = styled.li`
  list-style: none;
`;

const ScreenReaderH2 = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 1px, 1px);
  white-space: nowrap;
  border: 0;
`;

/* tour */

const TourFocus = styled.div`
  position: relative;
  border-radius: inherit;
`;
