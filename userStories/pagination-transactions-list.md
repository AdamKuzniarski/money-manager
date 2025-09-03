# pagination-transactions-list

## Value Proposition

**As a user**

**I want to** be able to navigate between pages of the transactions list 
            within the same page of the application

**so that** I can quickly browse large sets of transactions without losing 
            context or reloading the entire page
## Description

Capstone Group Todo: Add wireframes

## Acceptance Criteria

- Pagination controls(next/previous, page numbers, items per page selector)
    are displayed under the transactions list
- Items per page options: 10, 15, 20
- The UI clearly indicates which page the user is on
- Disable Previous button on first page and Next button on last page
- filtered resutls are paginated when the transachtios list is too long
- pagination adjusts if filtered data is samller then 10 results
- pagination are handled on client side only.(no API changes required)
- Account balance always shows the current balance, independent of pagination or filtering.

## Tasks

- [ ] Create feature branch `feature/pagination`
- [ ] Create a reusable Pagination component 
    - [ ] Props: currentPage, totalPage, pageSize, onPageChange, onPageSizeChange
    - [ ] Render: Previous/Page Numbers/Next + dropdown for items per page
- [ ] Add default config: pageSize = 10 (make adjustable up to 50)
- [ ] Implement logic to slice the transactions list on the client based on 
    currentPage and pageSize
- [ ] Reset to page 1 when pageSize changes


