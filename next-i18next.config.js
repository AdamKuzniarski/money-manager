/** @type {import('next-i18next').UserConfig} */
const isServer = typeof window === "undefined";

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    localeDetection: false,
  },
  react: { useSuspense: false },
};
