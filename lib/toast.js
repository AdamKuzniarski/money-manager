import { toast } from "react-toastify";

function getTranslateFn(translationInput) {
  if (typeof translationInput === "function") return translationInput;          // z.B. translate
  if (translationInput?.translate) return translationInput.translate;           // z.B. { translate }
  return (key) => key;                                                          // Fallback
}

export const notify = {
  // --- CRUD ---
  saved(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.success(translate("toasts.saved"));
  },
  deleted(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.success(translate("toasts.deleted"));
  },
  error(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.error(translate("toasts.error"));
  },

  // --- Export/Import (Erfolg) ---
  dataSaved(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.success(translate("toasts.dataSaved"));
  },
  importSuccessful(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.success(translate("toasts.importSuccess"));
  },
  exportSuccessful(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.success(translate("toasts.exportSuccess"));
  },
  dataSavedCount(count, translationInput) {
    const translate = getTranslateFn(translationInput);
    // Nutzt Pluralisierung aus deinen JSONs (dataSavedCount / dataSavedCount_plural)
    toast.success(translate("toasts.dataSavedCount", { count }));
  },

  // --- Import Status/Infos ---
  importImProgress(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.info(translate("toasts.importInProgress"));
  },
  missedSelectedFile(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.info(translate("toasts.selectFileBefore"));
  },
  selectCsvFile(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.info(translate("toasts.onlyCsv"));
  },

  // --- Export/Import (Fehler) ---
  importFailed(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.error(translate("toasts.importFail"));
  },
  parseImportFailed(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.error(translate("toasts.parseFail"));
  },
  importFailedCantReadData(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.error(translate("toasts.readFail"));
  },
  exportFailed(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.error(translate("toasts.exportFail"));
  },
  noDataToExport(translationInput) {
    const translate = getTranslateFn(translationInput);
    toast.error(translate("toasts.noData"));
  },
};
