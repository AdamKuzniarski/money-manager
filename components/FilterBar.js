import { useState } from "react";
import { useI18n } from "@/lib/use-i18n";
import { labelForCategory } from "@/lib/use-i18n";
import styled from "styled-components";

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
  const { translate } = useI18n();

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
            {translate("filters.category")}
            <select
              value={value}
              onChange={(event) => onChangeCategory(event.target.value)}
            >
              <option value="">{translate("filters.allCategories")}</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {labelForCategory(translate, category.name)}
                </option>
              ))}
            </select>
          </label>
        
        <Field>
          <label htmlFor="time-filter">{translate("filters.timeFilter")}</label>
          <TimeSelect
            id="time-filter"
            onChange={handleTimeFilterChange}
            value={preset}
            data-tour="time-filter"
          >
            <option value="all">{translate("filters.all")}</option>
            <option value="today">{translate("filters.today")}</option>
            <option value="7">{translate("filters.last7")}</option>
            <option value="30">{translate("filters.last30")}</option>
            <option value="month">{translate("filters.thisMonth")}</option>
            <option value="custom">{translate("filters.custom")}</option>
          </TimeSelect>
        </Field>
        {showCustomModal && (
          <Backdrop onClick={closeModal} aria-modal="true" role="dialog">
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <h3>{translate("filters.customRange")}</h3>
              <div>
                <label>
                  {translate("filters.from")}
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(event) => setCustomFrom(event.target.value)}
                  />
                </label>
                <label>
                  {translate("filters.to")}
                  <input
                    type="date"
                    value={customTo}
                    onChange={(event) => setCustomTo(event.target.value)}
                  />
                </label>
              </div>
              <ModalActions>
                <button type="button" onClick={closeModal}>
                  {translate("common.cancel")}
                </button>
                <button type="button" onClick={applyCustomRange}>
                  {translate("common.apply")}
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
