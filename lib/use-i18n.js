import { useTranslation } from "next-i18next";

//hilfs Hook `useI18n`. für übersetzungen
//nimmt optional einen Namespace-Namen (Standard: "common").
//namespace ist wie eine "Gruppe/Datei" deiner Übersetzungen.
export function useI18n(nameSpace = "common") {
  //t ein funtkion , um texte per schlüssel zu übersetzen
  //`i18n`: infos & funktionen rund um die aktuelle Sprache
  const { t, i18n} = useTranslation(nameSpace);
  const translate = t; // nur alias für Lesbarkeit
const lang = i18n.resolvedLanguage || i18n.language || "en";
  return {translate,i18n,lang};
}

//`translate` ist deine übersetzungsfunktion.
//`categoryname` ist der technische name der kategorie (z. B. "rent").
export function labelForCategory(translate, categoryName) {
  //versucht, den text unter "categories.<categoryName>" zu holen.
  //beispiel: categoryName = "rent" -> Key "categories.rent".
  //defaultValue: falls der key fehlt, nimm einfach den original-namen
  return translate(`categories.${categoryName}`, { defaultValue: categoryName });
}
