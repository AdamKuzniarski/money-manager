import { STATE } from "@/constants/state";
import styled from "styled-components";
import { useI18n } from "@/lib/use-i18n";

export default function IncomeExpenseView({ onFilter, filterType }) {
  //Change radio button
  const handleFilterType = (event) => {
    const filterValue = event.target.value;
    onFilter(filterValue);
  };

  const formatLabel = (key) => key.charAt(0) + key.slice(1).toLowerCase();
  const { translate } = useI18n();
  return (
    <form aria-labelledby="type-legend">
      <Legend id="type-legend">{translate("filters.byType")}</Legend>
      <Pills>
        {Object.values(STATE).map((value) => (
          <PillLabel key={value}>
            <HiddenRadio
              type="radio"
              name="state"
              value={value}
              checked={filterType === value}
              onChange={handleFilterType}
            />
            {translate(`filters.type.${value}`)}
          </PillLabel>
        ))}
      </Pills>
    </form>
  );
}

const PillLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 25px;
  cursor: pointer;
  &:has(input:checked) {
    background: var(--pb-100);
    color: var(--pb-900);
    box-shadow: 0 0 0 1px var(--pb-400) inset;
  }
  &:has(input:focus-visible) {
    outline: 2px solid var(--focus-ring, #0b43ff);
    outline-offset: 2px;
  }
`;

const Legend = styled.legend`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
`;

const Pills = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 6px;
  padding: 8px;
  border-radius: 25px;
  background: var(--surface, #f7f9fc);
  box-shadow: inset 0 0 0 1px var(--pb-200, #b3dcff);
`;

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
  pointer-events: none;
`;
