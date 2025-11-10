# First-Run Guided Tour with driver.js (Highlight Guide)

## Value Proposition

**As a new user**

**I want to** get a short, focused tour, that highlights the most important features of the Money Manager

**so that** I can see how to: add a new transaction, delete transaction, edit a transaction, where are the features like charts, how work filter functions etc.

## Description

A short, skippable, first-run guide users driver.js to highlight key UI elements
The tour runs once per device, (persisted in local storage)

## Acceptance Criteria

- The tour users driver.js to spotlight real elements in the current page without breaking layout
- The tour appears only on first app launch - for  new users and is skippable at any time
- Each step has clear, short explaining the element's purpose
- The first-run is with keyboard supported - focus 
- A flag in localStorage e.g. hasSeenTour="true" prevents auto-rerun after completion or skip

## Tasks

- [ ] Create a new folder `tour` and file `steps.js` for the guide
- [ ] Add data attributes **Research** to targeted elements `data-tour="..."`
- [ ] Add button/ checkbox to restart tour or skip tour
- [ ] Implement `TourManager`library utility that can:
  - [ ] Check and set localStorage to hasSeen="true"
  - [ ] Start, stop and restart or skip the tour
