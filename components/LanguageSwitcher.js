import { useEffect, useCallback } from "react"; //React-Hooks: Side-Effects (useEffect) &
// Memoisierung von Funktionen (useCallback)
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next"; //i18n-Hook: liefert Übersetzungsfunktion t und i18n-Instanz
import styled from "styled-components";

const PERSISTED_LANGUAGE_KEY = "app.lang"; //Schlüsselname für localStorage (darin merken wir die gewählte Sprache)

export default function LanguageSwitcher() {
  const router = useRouter();
  const { t: translate, i18n: i18nInstance } = useTranslation("common"); //?

  //Funktion zum Wechseln der Sprache (per i18n + Router + localStorage)
  //die funktion behält ihre identität und wird nicht bei jedem render neu gebaut
  const applyLanguageChange = useCallback(
    async (newLanguage) => {
      const currentLanguage = i18nInstance?.language; //aktuell gesetzte Sprache (z. B. "en" oder "de")

      //nichts tun wenn bereits aktiv
      if (newLanguage === currentLanguage || newLanguage === router.locale) {
        if (typeof window !== "undefined") {
          localStorage.setItem(PERSISTED_LANGUAGE_KEY, newLanguage); //trotzdem Auswahl speichern
        }
        return;
      }
      //i18next auf neue Sprache umschalten (lädt ggf. Übersetzungen)
      await i18nInstance?.changeLanguage?.(newLanguage);

      //für zukünftige Sessions speichern
      if (typeof window !== "undefined") {
        localStorage.setItem(PERSISTED_LANGUAGE_KEY, newLanguage);
      }

      //Sprache (Locale) der aktuellen Route auf `newLanguage` umstellen
      //gleiche URL behalten (router.asPath), nur die Sprache ändern
      //Seite in neuer Sprache rendern (SSR/CSR), ohne neuen Verlaufseintrag
      router.replace(router.asPath, undefined, {
        locale: newLanguage,
      });
    },
    [i18nInstance, router] //die useCallback hängt nur vom i18Instance und router
  );

  //Beim ersten Rendern: gespeicherte Sprache aus dem Browser wiederherstellen
  useEffect(
    () => {
      const savedLanguage =
        typeof window !== "undefined"
          ? localStorage.getItem(PERSISTED_LANGUAGE_KEY)
          : null;

      //Wenn eine gespeicherte Sprache existiert
      // und sie sich von der aktuellen unterscheidet

      if (
        savedLanguage &&
        savedLanguage !== (i18nInstance?.language ?? router.locale)
      ) {
        applyLanguageChange(savedLanguage);
      }
    },

    //Die Funktion wird im Effekt aufgerufen.
    //Wenn sich ihre Referenz ändert, soll der Effekt neu laufen.
    //Dank useCallback bleibt sie stabil, außer i18n/router ändern sich.)

    //Aktuelle i18n-Sprache. Wechselt sie (z. B. durch changeLanguage),
    //soll der Effekt erneut prüfen/übernehmen.

    //Aktuelle Next.js-Locale aus der URL. Ändert sich die Locale im Routing,
    //wird der Effekt erneut ausgeführt, um alles zu synchronisieren.
    [applyLanguageChange, i18nInstance?.language, router.locale]
  );

  const currentUiLanguage = i18nInstance.language?.startsWith("de")
    ? "de"
    : "en";
  
  return (
    <div style={{ marginLeft: "auto" }}>
      <LanguageButton
        value={currentUiLanguage}
        onChange={(event) => applyLanguageChange(event.target.value)}
        aria-label={translate("intl.language")}
      >
        <option value="en">{translate("intl.en")}</option>
        <option value="de">{translate("intl.de")}</option>
      </LanguageButton>
    </div>
  );
}

const LanguageButton = styled.select`
  color: var(--foreground);
  margin-bottom: 10px;
  margin-top: 8px;
  padding: 12px 8px;
`;
