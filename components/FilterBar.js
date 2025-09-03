export default function FilterBar({
  value,
  categories = [],
  onChangeCategory,
  onClearCategory,
}) {
  return (
    <div>
      <select
        value={value}
        onChange={(event) => onChangeCategory(event.target.value)}
      >
        <option value="">All Categories </option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {value && (
        <button type="button" onClick={onClearCategory}>
          Clear Filter
        </button>
      )}
    </div>
  );
}
