import { useState, useMemo } from "react";
import styled from "styled-components";
import { useI18n } from "@/lib/use-i18n";
import { labelForCategory } from "@/lib/use-i18n";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2e70ff" /* pb-500 */,
  "#0b43ff" /* pb-600 */,
  "#0239ff" /* pb-700 */,
  "#559aff" /* pb-400 */,
  "#85c3ff" /* pb-300 */,
  "#0532c7" /* pb-800 */,
  "#0f34a0" /* pb-900 */,
  "#091d5d" /* pb-950 */,
  "#b3dcff" /* pb-200 */,
  "#d4eeff" /* pb-100 */,
];

function toCurrencyEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function buildCategoryData(transactions = [], type) {
  const filtered = type
    ? transactions.filter((transaction) => transaction.type === type)
    : transactions;

  const sums = filtered.reduce((acc, t) => {
    const category = t?.category || "Uncategorized";
    const amount = Math.abs(Number(t?.amount));
    if (!Number.isFinite(amount)) return acc;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  return Object.entries(sums)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export default function CategoryPieChart({ transactions = [] }) {
  const [mode, setMode] = useState("expense");
  const { translate } = useI18n();

  const data = useMemo(
    () => buildCategoryData(transactions, mode),
    [transactions, mode]
  );

  const total = useMemo(
    () => data.reduce((sum, data) => sum + data.value, 0),
    [data]
  );

  if (transactions.length === 0) {
    return <EmptyState>{translate("charts.noTransactions")}</EmptyState>;
  }

  return (
    <Wrapper>
      <TopBar>
        <ModeButton
          type="button"
          onClick={() => setMode("expense")}
          $active={mode === "expense"}
        >
          {translate("charts.expense")}
        </ModeButton>
        <ModeButton
          type="button"
          onClick={() => setMode("income")}
          $active={mode === "income"}
        >
          {translate("charts.income")}
        </ModeButton>
      </TopBar>
      <TotalText>
        {translate("charts.total")}: <strong>{toCurrencyEUR(total)}</strong>
      </TotalText>
      {data.length === 0 ? (
        <EmptyState>
          {translate("charts.noDataFor", { mode: translate(`charts.${mode}`) })}
        </EmptyState>
      ) : (
        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={45}
                isAnimationActive
              >
                {data.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name) => [
                  toCurrencyEUR(val),
                  labelForCategory(translate, name),
                ]}
                separator=" "
              />
              <Legend
                formatter={(value) => labelForCategory(translate, value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 12px;
  background: var(--surface-elevated, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: var(--radius);
`;

const TopBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const ModeButton = styled.button`
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid var(--border, #e5e7eb);
  background: ${({ $active }) =>
    $active ? "var(--pb-100)" : "var(--surface-elevated)"};
  color: ${({ $active }) => ($active ? "var(--pb-800)" : "inherit")};
  transition: background 120ms ease, transform 80ms ease;
  &:hover {
    transform: translateY(-1px);
  }
`;

const TotalText = styled.p`
  text-align: center;
  margin: 8px 0 4px;
  font-weight: 500;
`;

const EmptyState = styled.p`
  text-align: center;
  margin: 12px 0;
  color: var(--muted-foreground, #6b7280);
`;
