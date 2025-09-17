import styled from "styled-components";


export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  filteredTransactions,
}) {
  return (
    <PaginationWrapper>
      {/* previous button */}
      {totalPages > 1 && (
        <>
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <PageInfo>
            Page {currentPage} of {totalPages}
          </PageInfo>

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </>
      )}
      {/* items per page */}
      <Select
        value={pageSize}
        onChange={(event) => {
          const size = Number(event.target.value);
          onPageSizeChange(size);
          if (currentPage !== 1) {
            onPageChange(1);
          }
        }}
        data-tour="per-page"
      >
        {[10, 15, 20].map((size) => (
          <option key={size} value={size}>
            {size} per page
          </option>
        ))}
      </Select>
      
    </PaginationWrapper>
  );
}

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
  margin: 20px 0 20px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--border);
  background: var(--surface-elevated);
  border-radius: var(--radius-sm);
  cursor: pointer;
  &:hover {
    filter: brightness(1.02);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
`;

const Select = styled.select`
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface-elevated);
  color: var(--foreground);
  font-size: small;
  width: 30%;
`;
