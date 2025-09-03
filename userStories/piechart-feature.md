
 # name: Pie Chart for Categories


## Value proposition
As a User
**I want to** see a pie chart of my transactions grouped by category
**so that** I can easily understand which categories make up the biggest part of my spending and income.
In order to <benefit/purpose>
## Description

A pie chart will be displayed on the HomePage (or in separate "Statistics") section to visualize the distribution of transactions

## Acceptance criteria
- The chart shows all categories represented in transactions.
- The size of each slice corresponds to the total amount for that category.
- Income vs. expense categories are visually differentiated.
- Hovering or tapping a slice displays the category name and total amount.
-If no transactions exist, the chart area shows a placeholder message "No transactions available"
## Tasks
- [ ] Create a new component `CategoryPieChart`
- [ ] Fetch transactions data and aggregate totals by category.
- [ ] Use a chart library **RESEARCH** possibly `recharts` to render a pie chart.
- [ ] Apply a chart library schemes for income / expenses.
- [ ] Add tooltip for category name and total value.

