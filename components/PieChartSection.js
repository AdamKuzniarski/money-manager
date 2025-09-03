import CategoryPieChart from "./CategoryPieChart";

export default function PieChartSection({ transactions, open }) {
  if (!open) return null;
  return <div>{<CategoryPieChart transactions={transactions} />}</div>;
}
