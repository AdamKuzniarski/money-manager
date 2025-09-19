import useSWR from "swr";
import styled from "styled-components";
import CategoryPieChart from "@/components/CategoryPieChart";
import AccountBalanceTimeline from "@/components/AccountBalanceTimeline";
import { Card } from "@/components/ui/Primitives";
import { useState } from "react";
import { useI18n } from "@/lib/use-i18n";

//helpers
function formatDate(isoString, locale = "en") {
  if (!isoString) return "...";

  return new Date(isoString).toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function computeRange(presetKey) {
  const today = new Date();

  function toLocalISOString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const todayISO = toLocalISOString(today);

  function subtractDaysFromToday(numberOfDays) {
    const copy = new Date(today);
    copy.setDate(copy.getDate() - numberOfDays);
    return toLocalISOString(copy);
  }

  function firstDayOfCurrentYear() {
    return `${today.getFullYear()}-01-01`;
  }

  if (presetKey === "7") {
    return { dateFrom: subtractDaysFromToday(6), dateTo: todayISO };
    {
      translate("charts.range.7d");
    }
  }
  if (presetKey === "30") {
    return { dateFrom: subtractDaysFromToday(29), dateTo: todayISO };
  }
  if (presetKey === "90") {
    return { dateFrom: subtractDaysFromToday(89), dateTo: todayISO };
  }
  if (presetKey === "ytd") {
    return { dateFrom: firstDayOfCurrentYear(), dateTo: todayISO };
  }
  if (presetKey === "all") {
    return { dateFrom: "", dateTo: todayISO };
  }
  return { dateFrom: "", dateTo: todayISO };
}

export default function Analytics() {
  const {
    data: transactions = [],
    error,
    isLoading,
  } = useSWR("/api/transactions");
  const { translate } = useI18n();

  // Tabs
  const [view, setView] = useState("pie");

  // Range state default -> 30 days

  const initial = computeRange("30");
  const [preset, setPreset] = useState("30");
  const [dateFrom, setDateFrom] = useState(initial.dateFrom);
  const [dateTo, setDateTo] = useState(initial.dateTo);

  if (error)
    return <StatusMessage>{translate("charts.failedToLoad")}</StatusMessage>;
  if (isLoading)
    return <StatusMessage>{translate("charts.loading")}</StatusMessage>;

  function applyPreset(preset) {
    const { dateFrom, dateTo } = computeRange(preset);
    setPreset(preset);
    setDateFrom(dateFrom);
    setDateTo(dateTo);
  }

  function onCustomChange({ from, to }) {
    setPreset("custom");
    setDateFrom(from || "");
    setDateTo(to || "");
  }

  const showRangeBadge = Boolean(
    (dateFrom && dateFrom.trim()) || (dateTo && dateTo.trim())
  );

  return (
    <div>
      <Tabs role="tablist" aria-label="Analytics views">
        <TabButton role="tab" onClick={() => setView("pie")}>
          {translate("charts.categories")}
        </TabButton>
        <TabButton role="tab" onClick={() => setView("time")}>
          {translate("charts.time")}
        </TabButton>
      </Tabs>
      {view === "pie" && (
        <ChartWrapper
          as="figure"
          aria-labelledby="chart-title"
          role="group"
          data-tour="analytics-chart"
        >
          <ChartTitle id="chart-title">{translate("charts.title")}</ChartTitle>
          <Card>
            <CategoryPieChart transactions={transactions} aria-hidden />
          </Card>
          <ScreenReaderfigcaption>
            <p role="note" aria-label={translate("charts.summaryAria")}>
              {translate("charts.summaryText")}
            </p>
          </ScreenReaderfigcaption>
        </ChartWrapper>
      )}

      {view === "time" && (
        <section>
          <RangeBar aria-label="Time range selection">
            <PresetButton
              onClick={() => applyPreset("7")}
              $active={preset === "7"}
            >
              {translate("charts.range.7d")}
            </PresetButton>
            <PresetButton
              onClick={() => applyPreset("30")}
              $active={preset === "30"}
            >
              {translate("charts.range.30d")}
            </PresetButton>
            <PresetButton
              onClick={() => applyPreset("90")}
              $active={preset === "90"}
            >
              {translate("charts.range.90d")}
            </PresetButton>
            <PresetButton
              onClick={() => applyPreset("ytd")}
              $active={preset === "ytd"}
            >
              {translate("charts.range.ytd")}
            </PresetButton>
            <Spacer />
            <label>
              {translate("charts.range.from")}
              <input
                type="date"
                value={dateFrom}
                onChange={(e) =>
                  onCustomChange({ from: e.target.value, to: dateTo })
                }
              />
            </label>
            <label>
              {translate("charts.range.to")}
              <input
                type="date"
                value={dateTo}
                onChange={(e) =>
                  onCustomChange({ from: dateFrom, to: e.target.value })
                }
              />
            </label>
          </RangeBar>

          {showRangeBadge && (
            <ActiveRange aria-live="polite">
              {formatDate(dateFrom, typeof navigator !== "undefined" ? navigator.language : "en")}
              {formatDate(dateTo, typeof navigator !== "undefined" ? navigator.language : "en")}
            </ActiveRange>
          )}

          <AccountBalanceTimeline
            transactions={transactions}
            startDate={dateFrom || null}
            endDate={dateTo || null}
          />
        </section>
      )}
    </div>
  );
}

const ChartWrapper = styled.section`
  max-width: 560px;
  margin: 0 auto;
  padding: 12px;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`;

const ChartTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: left;
`;

const StatusMessage = styled.p`
  margin: 16px 20px;
  font-size: 0.95rem;
  color: var(--muted-foreground, #6b7280);
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 0 auto 10px;
`;

const TabButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: ${({ $active }) =>
    $active ? "var(--pb-100)" : "var(--surface-elevated)"};
  color: ${({ $active }) => ($active ? "var(--pb-800)" : "inherit")};
`;

const RangeBar = styled.div`
  max-width: 560px;
  margin: 0 auto 6px;
  padding: 8px;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(4, auto) 1fr repeat(2, minmax(0, 1fr));
  align-items: center;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
`;

const PresetButton = styled.button`
  border-radius: 12px;
  padding: 6px 10px;
  background: ${({ $active }) =>
    $active ? "var(--pb-100)" : "var(--surface-elevated)"};
  color: ${({ $active }) => ($active ? "var(--pb-800)" : "inherit")};
`;

const Spacer = styled.div`
  flex: 1;
`;

const ActiveRange = styled.p`
  max-width: 560px;
  margin: 6px auto 8px;
  text-align: center;
  opacity: 0.85;
`;

const ScreenReaderfigcaption = styled.figcaption`
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
