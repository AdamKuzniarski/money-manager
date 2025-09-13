# internationalisation

## Value proposition

**As a user**

**I want** the appliction to be available in different languages(e.g., Englisch, German, etc.),

**In order to** so that i can use the system in my preferred language without confusion or misunderstanding

## Description

<img width="640" height="707" alt="Image" src="https://github.com/user-attachments/assets/9c7c3866-3f53-4f82-8dd3-ef90c9fd340a" />

## Acceptance criteria

- The application detects the default language from the user's browser or account settings
- The user can manually switch the application language via a language selector
- All static texts(button, labels, error messages, etc.) are translated
- Dynamic content (e.g., imported transactions, categories)is displayed consistently regardless of the language
- Currency, date, and number formats follow the selected locale
- The system stores the users's language for future sessions

## Tasks

- [ ] Create a branch `feature/internationalisation`
- [ ] npm install i18next react-i18next next-i18next
- [ ] Add next-i18next.config.js in project root
- [ ] Update next.config.js to use the i18n config
- [ ] Create a `/public/locales/en/common.json` with english texts
- [ ] Create a `/public/locales/de/common.json` with german texts
- [ ] integrate i18next + next-i18next in \_app.js
- [ ] Create a `/components/LanguageSwitcher.js` (dropdown for EN/DE)
- [ ] Replace hardcoded UI texts with translation('key') calls (all components & pages)
- [ ] Save selected language in loacalStorage
- [ ] Format dates, numbers, and currency using Intl helpers(/lib/i18n-utils.js)
