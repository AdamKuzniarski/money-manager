import styled from "styled-components";
import { useI18n } from "@/lib/use-i18n";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

function buildAccountBalanceSeries(transactions = [], dateFrom, dateTo) {
  const startDate = dateFrom ? new Date(dateFrom) : undefined;
  const endDate = dateTo ? new Date(dateTo) : undefined;
  if (startDate) startDate.setHours(0, 0, 0, 0);
  if (endDate) endDate.setHours(23, 59, 59, 999);

  function toLocalISO(date) {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  const initialBalance = startDate
    ? transactions.reduce((acc, t) => {
        const date = new Date(t.date);
        const raw = Number(t.amount);
        if (!Number.isFinite(raw)) return acc;
        const signed = t.type === "expense" ? -Math.abs(raw) : Math.abs(raw);
        return date < startDate ? acc + signed : acc;
      }, 0)
    : 0;

  const filteredTransactions = transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;
      return true;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const sumsByDay = new Map();
  for (const transaction of filteredTransactions) {
    const day = new Date(transaction.date);
    const dayKey = toLocalISO(day);
    const rawAmount = Number(transaction.amount);
    if (!Number.isFinite(rawAmount)) continue;
    const signedAmount =
      transaction.type === "expense"
        ? -Math.abs(rawAmount)
        : Math.abs(rawAmount);
    sumsByDay.set(dayKey, (sumsByDay.get(dayKey) ?? 0) + signedAmount);
  }

  const sortedDays = Array.from(sumsByDay.keys()).sort();
  let runningBalance = initialBalance;
  const balanceSeries = [];
  for (const dayKey of sortedDays) {
    runningBalance += sumsByDay.get(dayKey);
    balanceSeries.push({
      date: dayKey,
      balance: Number(runningBalance.toFixed(2)),
    });
  }

  // Startpunkt zum gewählten Startdatum hinzufügen
  if (startDate) {
    balanceSeries.unshift({
      date: toLocalISO(startDate),
      balance: Number(initialBalance.toFixed(2)),
    });
  }
  return balanceSeries;
}

export default function AccountBalanceTimeLine({
  transactions = [],
  startDate,
  endDate,
}) {
  const data = buildAccountBalanceSeries(transactions, startDate, endDate);
  const { translate, i18n, lang } = useI18n("common");
  const nfCurrency = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
  });
  const df = (iso) => new Date(iso).toLocaleDateString(lang);
  return (
    <Wrapper as="figure" aria-labelledby="timeline-title" role="group">
      <Title id="timeline-title">{translate("timeline.title")}</Title>
      <CardLike>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              minTickGap={24}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("de-DE")
              }
              tickMargin={8}
            />
            <YAxis width={96} tickFormatter={(value) => nfCurrency.format(value)} />
            <ReferenceLine y={0} strokeDasharray="2 2" />
            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("de-DE")
              }
              formatter={(value) => [nfCurrency.format(value), translate("timeline.balance")]}
            />
            <Line
              type="monotone"
              dataKey="balance"
              dot={true}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardLike>
      <SrCaption>{translate("timeline.caption")}</SrCaption>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 560px;
  margin: 0 auto;
  padding: 12px;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`;

const CardLike = styled.div`
  background: var(--surface);
  border-radius: var(--radius);
  width: 100%;
  height: 300px;
`;

const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: left;
`;

const SrCaption = styled.figcaption`
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
