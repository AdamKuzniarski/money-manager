import styled from "styled-components";
import { toCurrencyEUR } from "@/lib/format";

export default function AccountBalance({ transactions }) {
  if (!transactions) return null;

  const balance = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  return (
    <BalanceContainer>
      <h2>Account Balance</h2>
      <BalanceValue isNegative={balance < 0}>
        {toCurrencyEUR(balance)}
      </BalanceValue>
    </BalanceContainer>
  );
}

const BalanceContainer = styled.div`
  color: black;
  padding: 25px 35px;
  background: whitesmoke;
  border-radius: 25px;
  text-align: center;
  border: 2px solid black;
  max-width: 450px;
  margin-bottom: 1rem;
`;

const BalanceValue = styled.h2`
  color: ${({ isNegative }) => (isNegative ? "red" : "green")};
`;
