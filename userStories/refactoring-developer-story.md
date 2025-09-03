---
name: Refactoring -DeveloperStory
---

## Value proposition

As a <Developer>
I want to <The HomePage> code to be easier to read, and maintain
So that <future changes are safer and fester> without altering behavior or design

## Description

- Primary: `/pages/index.js` (HomePage) - tidy, clarify and extract low-risk helper-functions

## Acceptance criteria

- [ ] Reduce the variety of states for ex. filter at the HomePage.
- [ ] Clear data flow - Filtering and totals are computed in clearly named helper-Functions ex. getFilteredTransactions, getTotals. Placet near top of the component or in a small local unit.
- [ ] Currency and date formatting are ien /lib/format.js and are used consistently through the page.
- [ ] UI extractions `<FilterBar>`, `<TotalsBar>`, `<PieChartSection>` are extracted to `/components` and reached out witch props to the parents ex. HomePage.
- [ ] Renaming ex. `handleCategoryChange`.
- [ ] Early returns for loading/error.
- [ ] No changes on visual surface of the app - UI and flows remain same.

## Tasks

- [ ] Fix the endpoints - change to useSWR("/api/categories")
- [ ] Add folder `/lib/format.js`
- [ ] Extract to the `/lib/format.js` toCurrecyEUR() helper-Function and utilize it on HomePage
- [ ] Extract to the `/lib/format.js` toDateDE() helper-Function and utilize it on HomePage
- [ ] Consistency in naming - rename in HomePage `ìsChartVisible` to is `isChartOpen`, `handleToogle` to `handleToggleForm` to be more descriptive.
- [ ] Make sure to extract only this functions/states that **not** are used locally on the HomePage
- [ ] Extracting helper-functions to `/lib/home-calcs.js`
- [ ] Extracting small parts like FilterBar, TotalsBar, PieChart to `/components/FilterBar.js` `/components/TotalsBar.js` ...
