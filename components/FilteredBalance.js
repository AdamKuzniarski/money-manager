import { toCurrencyEUR } from "@/lib/format";
import styled from "styled-components";

export default function FilteredBalance({ value }) {
  return (
    <FilteredBalanceRow>
      <BalanceWrapper
        $neg={value < 0}
        title="Filtered Balance:"
        aria-live="polite"
        aria-label={`Filtered balance is ${value.toFixed(2)} euros`}
      >
        Filtered Balance: {toCurrencyEUR(value)}
      </BalanceWrapper>
    </FilteredBalanceRow>
  );
}

const BalanceWrapper = styled.span`
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
