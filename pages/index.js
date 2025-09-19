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
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { serverSideTranslations } from "next-i18next/serverSideTranslations"; //so kennt die seite beim ersten laden alle texte
import { useI18n } from "@/lib/use-i18n"; //hook, der translate bereitstellt

export default function HomePage() {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  //pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { translate } = useI18n();

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

  //Early returns
  if (error)
    return (
      <Status role="status" aria-live="polite">
        {translate("screen.failedToLoad")}
      </Status>
    );
  if (isLoading)
    return (
      <Status role="status" aria-live="polite">
        {translate("common.loading")}
      </Status>
    );

  // Handler
  function handleCancelEdit() {
    setEditingTransaction(null);
    setIsFormOpen(false);
  }
  function handleEdit(transaction) {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
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

  function handleDatePreset(preset) {
    const today = new Date();
    const to = today.toISOString().slice(0, 10);
    const firstDayOfThisMonthISO = () => {
      const day = new Date(today.getFullYear(), today.getMonth(), 1);
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}-01`;
    };
    let from = "";
    if (preset === "today") {
      from = to;
    } else if (preset === "7") {
      const date = new Date(today);
      date.setDate(date.getDate() - 6);
      from = date.toISOString().slice(0, 10);
    } else if (preset === "30") {
      const date = new Date(today);
      date.setDate(date.getDate() - 29);
      from = date.toISOString().slice(0, 10);
    } else if (preset === "month") {
      from = firstDayOfThisMonthISO();
    } else if (preset === "all") {
      setFilters((filter) => ({
        ...filter,
        dateFrom: "",
        dateTo: "",
        timePreset: "all",
      }));
      setCurrentPage(1);
      return;
    }

    setFilters((filter) => ({
      ...filter,
      dateFrom: from,
      dateTo: to,
      timePreset: preset,
    }));
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
    notify.saved(translate);
  }

  async function handleDelete(id) {
    const confirm = window.confirm(translate("actions.confirmDelete"));

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
    notify.deleted(translate);
  }

  return (
    <Main aria-label="Finance dashboard" data-tour="introApp">
      <CardControls>
        <AuthButtons />
        <LanguageSwitcher />
      </CardControls>

    
      <Card data-tour="balance-summary">
        <TourFocus data-tour-target="inner">
          <AccountBalance transactions={transactions} />
        </TourFocus>
      </Card>
      <CardFilter>
        {isFiltered && (
          <FilteredBalanceRow>
            <FilteredBalance
              $neg={sumTotal < 0}
              title={translate("filters.filteredBalance")}
              aria-live="polite"
              aria-label={translate("filters.filteredBalanceAria")}
            >
              {translate("filters.filteredBalance")}: {toCurrencyEUR(sumTotal)}
            </FilteredBalance>
          </FilteredBalanceRow>
        )}

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
        {(filters.dateFrom || filters.dateTo) && (
          <ActiveFilterRow>
            <span role="label">{translate("filters.timeSpan")}:</span>
            <ActiveBadge role="label">
              {filters.dateFrom || " ... "}- {filters.dateTo || "..."}
            </ActiveBadge>
          </ActiveFilterRow>
        )}

        <IncomeExpenseView
          filteredTransactions={filteredTransactions}
          sumIncome={sumIncome}
          sumExpense={sumExpense}
          sumTotal={sumTotal}
          filterType={filters.type}
          onFilter={setFilterType}
        />
      </CardFilter>

      <TransactionsList aria-labelledby="transactions-title">
        <ScreenReaderH2 id="transactions-title">
          {translate("screen.transactionsTitle")}
        </ScreenReaderH2>

        {filteredTransactions.length === 0 ? (
          <EmptyState>{translate("screen.noResults")}</EmptyState>
        ) : (
          paginatedTransactions.map((transaction) => (
            <TransactionsListItem
              key={transaction._id}
              aria-label={translate("screen.transactionAria", {
                name: transaction.name ?? translate("screen.unknown"),
                amount: transaction.amount,
                date: transaction.date,
              })}
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

//Der Wrapper gibt deiner App den i18n-Context,
//damit useTranslation() überall funktioniert (auch beim Server-Rendern).
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])), //lädt das common namespace für die aktuelle sprache
    },
  };
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

const ActiveFilterRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0 12px 8px;
  min-width: 0;
  font-size: 0.95rem;
`;

const ActiveBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 25px;
  background: var(--pb-100);
  color: var(--pb-700);
  border: 1px solid var(--pb-200);
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

const FilteredBalance = styled.span`
  padding: 4px 10px;
  border-radius: 25px;
  border: 1px solid var(--pb-200);
  background: var(--surface);
  font-weight: 700;
  white-space: nowrap;
  color: ${({ $neg }) => ($neg ? "#b91c1c" : "#166534")};
  min-width: 100%;
  overflow: hidden;
`;

const FilteredBalanceRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin: 0 12px 8px;
  min-width: 0;
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

