# User Story : Authentication with Google and Github

## Value Proposition

**As** `a User`
**I want** to log in and out with a single button via Google or Github.
**So that** I can access and leave the application securely with creating my own account.

## Description

OAuth via Google and GitHub with session persistence (MongoDB Adapt).
Public pages show a **Login** button, protected areas show a **Logout** button.
Unauthorized users are redirected to `/login` area.
After login, the user is redirected to the dashboard, after logout, to the login page.

## Acceptance Criteria

- UI (unauthenticated): Public view which shows a **Login** button.
- UI (authenticated): Showing **Logout** button.
- Clicking **Login** button opens a provider selection (Google/GitHub), successful login redirect to the HomePage.
- Clicking **Logout** button ends the session and redirects to login `RESEARCH :modal/area`
- **New User** First login creates a user entry in the database with own user's account.
- Session is maintained across page reloads.
- Give access to the page after logging in
- Login route protection - protected areas whole application except by login modal
- Buttons show a loading indicator (probably spinner and disabled) during login/logout process.
- If login fails inform the user `access denied/ error`
- The use can choose between providers RESEARCH (GitHub /Google)
- Database (MongoDB) persists users and sessions

## Tasks

- [ ] Create a new branch `feature/auth`
- [ ] Do in terminal npm i to install packages with `next-auth`, `@next-auth/mongodb-adapter`
- [ ] Add to .env.local to MONGODB_URI - NEXTAuth,.... google `RESEARCH`
- [ ] Create MongoDB client helper for MongoDB Adapter
- [ ] Create a new component for singIn/singOut to login in protected page if not shows login modal
- [ ] Add loading states -spinner or/and disabled during login/logout
- [ ] The Login button shows the state of logging login/logout
- [ ] Connect with providers
- [ ] Add user's normalization -avoid duplicates, set to the provider - provide your mail and account-name
- [ ] If the logging in failed show a message `access denied/ error`
- [ ] Update UI state dynamically based on session
