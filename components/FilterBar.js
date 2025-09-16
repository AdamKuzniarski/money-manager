import { useState } from "react";
import styled from "styled-components";
import { PRESETS } from "@/constants/presets";

export default function FilterBar({
  value,
  categories = [],
  onChangeCategory,
  dateFrom,
  dateTo,
  preset,
  onChangeDates,
  onPreset,
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customFrom, setCustomFrom] = useState(dateFrom ?? "");
  const [customTo, setCustomTo] = useState(dateTo ?? "");

  function handleTimeFilterChange(event) {
    const value = event.target.value;
    if (value === "custom") {
      setCustomFrom(dateFrom ?? "");
      setCustomTo(dateTo ?? "");
      setShowCustomModal(true);
      return;
    }

    onPreset(value);
  }

  function applyCustomRange() {
    onChangeDates({ dateFrom: customFrom || "", dateTo: customTo || "" });
    setShowCustomModal(false);
  }

  function closeModal() {
    setShowCustomModal(false);
  }

  return (
    <Bar data-tour="filter-bar">
      <label>
        Category
        <select
          value={value}
          onChange={(event) => onChangeCategory(event.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <Field>
        <label htmlFor="time-filter">Time Filter</label>
        <TimeSelect
          id="time-filter"
          onChange={handleTimeFilterChange}
          value={preset}
          data-tour="time-filter"
        >
          <option value={PRESETS.ALL}>All</option>
          <option value={PRESETS.TODAY}>Today</option>
          <option value={PRESETS.LAST7DAYS}>Last 7 Days</option>
          <option value={PRESETS.LAST30DAYS}>Last 30 Days</option>
          <option value={PRESETS.MONTH}>This Month</option>
          <option value={PRESETS.CUSTOM}>Custom...</option>
        </TimeSelect>
      </Field>
      {(dateFrom || dateTo) && (
        <ActiveFilterRow>
          <span role="label">Time span:</span>
          <ActiveBadge role="label">
            {dateFrom || "..."} - {dateTo || "..."}
          </ActiveBadge>
        </ActiveFilterRow>
      )}
      {showCustomModal && (
        <Backdrop onClick={closeModal} aria-modal="true" role="dialog">
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <h3>Custom range</h3>
            <div>
              <label>
                From
                <input
                  type="date"
                  value={customFrom}
                  onChange={(event) => setCustomFrom(event.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="date"
                  value={customTo}
                  onChange={(event) => setCustomTo(event.target.value)}
                />
              </label>
            </div>
            <ModalActions>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" onClick={applyCustomRange}>
                Apply
              </button>
            </ModalActions>
          </ModalCard>
        </Backdrop>
      )}
    </Bar>
  );
}

const Bar = styled.section`
  display: grid;
  gap: 12px;
  background: var(--surface);
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  input[type="date"]::-webkit-calendar-picker-indicator {
    background: var(gray);
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const TimeSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-elevated);
  color: var(--foreground);
`;
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 50;
`;

const ModalCard = styled.div`
  width: min(520px, 92vw);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-elevated);
  color: var(--foreground);
  padding: 16px;
  box-shadow: var(--shadow);
`;
const ModalActions = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
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
