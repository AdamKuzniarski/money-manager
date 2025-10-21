const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
    localeDetection: false,
  },
  // wichtig, damit Vercel die Dateien sicher findet:
  localePath: path.resolve("./public/locales"),
  // ALLE verwendeten Namespaces auflisten:
  ns: ["common"],
  defaultNS: "common",
  react: { useSuspense: false },
};
