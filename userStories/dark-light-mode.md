---
name: Dark / Light Mode
---

## Value proposition

As a <user>
I want to switch between dark and light mode
So that I can choose the appearance that is most comfortable for me <benefit/purpose>

## Description

- The app supports both dark mode and light mode.
- The theme is controlled by CSS variables defined in the global styles
- The selected mode persists across page reloads

## Acceptance criteria

- [ ] A toggle button is visible on the HomePage
- [ ] Clicking the button switches the theme between dark and light mode
- [ ] The current mode is stored(e.g, localStorage) so it remains active after reloads
- [ ] The UI clearly reflect the active mode(e.g, button label/icon)

## Tasks

- [ ] Create feature branch `feature/dark-light-mode`
- [ ] Define CSS variables for both themes in `GlobalStyle`
- [ ] Add a toggle button on the HomePage
- [ ] Implement state for isDarkMode with default value form localStorage
- [ ] Update CSS variables dynamically when mode changes
- [ ] Persist mode in localStorage
