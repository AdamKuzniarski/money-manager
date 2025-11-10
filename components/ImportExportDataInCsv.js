import styled from "styled-components";
import Papa from "papaparse";
import { useI18n } from "@/lib/use-i18n";
import useSWR, { mutate } from "swr";
import { notify } from "@/lib/toast";

export default function ImportExportDataInCsv() {
  const { data: transactions = [] } = useSWR("/api/transactions");
  const { translate } = useI18n();

  //Nimmt die bereits vorhandenen Datensätze aus dem Frontend(hier: importedItems)
  //und erstellt daraus eine csv datei
  async function handleExport() {
    try {
      //exportiere die bereits im Frontend vorhandenen Items
      if (transactions.length === 0) {
        notify.noDataToExport(translate);
        return;
      }

      //papaparse macht aus einem Array von Objekten eine csv datei
      const rowsForCsv = transactions.map((item) => ({
        name: item?.name ?? "",
        category: item?.category ?? "",
        date: item?.date ? new Date(item.date).toISOString().slice(0, 10) : "",
        amount: Number(item?.amount ?? 0),
        type: item?.type ?? "",
      }));
      const csvText = Papa.unparse(rowsForCsv, {
        columns: ["name", "category", "date", "amount", "type"],
      });

      //csv im browser zum downlod anbieten
      //aus dem csv-text ein blob-objekt bauen(datei ähnlicher speicher im browser)
      const csvBlob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });

      //aus dem blob temporäre url erzeugen, auf die der browser zugreifen kann
      const objectUrl = URL.createObjectURL(csvBlob);

      //ein <a>element(link) browser starten downloads zuverlässig über link
      const anchorElement = document.createElement("a");

      //den link so konfigurieren, dass er auf der temporäre datei zeigt
      anchorElement.href = objectUrl;

      //dem browser sagen unter werlchen namen gespeichert wird
      anchorElement.download = "transactions.csv";

      document.body.appendChild(anchorElement); //link ins DOM hängen
      anchorElement.click(); //click simulieren download
      anchorElement.remove(); //aufräumen
      URL.revokeObjectURL(objectUrl); //temporäre URL freigeben

      notify.exportSuccessful(translate);
    } catch (error) {
      console.error(error);
      notify.exportFailed(translate);
    }
  }

  //schickt alle importierte zeilen in einem request and die save-many route
  async function saveImportedTransactionsToDB(transactions) {
    //post an die neue api-route /api/transactions/save-many
    //senden {transactions:[..]im json-body}
    try {
      const response = await fetch("/api/transactions/save-many", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }), //backend erwartet: { name, amount, category, type, date }
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {}

      if (!response.ok) {
        console.error("Save failed(Server-Error).");
        mutate("/api/transactions");
      }

      return payload;
    } catch (error) {
      // netzwerkfehler (z. B. offline) oder clientfehler
      console.error("Save failed(network/client)");
    }
  }

  //read and import selected csv file
  async function handleImportSubmit(event) {
    event.preventDefault(); //formular nicht klassisch abschicken

    const formElement = event.currentTarget; //das <form> element
    const formData = new FormData(formElement); //formdata aus dem formular
    const selectedFile = formData.get("csvFile"); //datei aus dem <input name="csvFile">

    if (!selectedFile) {
      notify.missedSelectedFile(translate);
      return;
    }
    //prüfe ob der dateiname mit .csv endet
    if (!/\.csv$/i.test(selectedFile.name)) {
      notify.selectCsvFile(translate);
      return;
    }

    try {
      notify.importImProgress(translate);

      //papaparse liest die datei direkt im browser
      Papa.parse(selectedFile, {
        header: true, //erste zeile = spaltennamen
        skipEmptyLines: true, //leere zeilen ignorieren

        //wenn papaparse fertig ist
        complete: async (results) => {
          //falls parser fehler gemeldet hat: anzeigen & abbrechen
          if (results?.errors?.length) {
            console.error(results.errors);
            notify.parseImportFailed(translate);
            return;
          }
          //rohdaten in ein einheitliches format bringen
          const importedRows = (results?.data ?? []) //data ist ein array je csv zeile
            .map((row) => {
              //jede zeile aus der csv in unser objekt-format übertragen
              return {
                name: String(row?.name ?? "").trim(), //text trimmen
                category: String(row?.category ?? "").trim(), //text trimmen
                //datum: wenn vorhanden, so belassen. sonst leer
                date: row?.date ?? "",
                //betrag: erst , durch . ersetzen dann Number()
                amount: Number(String(row?.amount ?? "").replace(",", ".")),
                //typ klein schreiben (erwartet: "income" oder "expense")
                type: String(row?.type ?? "")
                  .trim()
                  .toLowerCase(),
              };
            })
            //validierung: pflichtfelder prüfen
            .filter(
              (normalized) =>
                normalized.name && //name muss vorhanden
                Number.isFinite(normalized.amount) && //betrag muss zahl sein
                (normalized.type === "income" || normalized.type === "expense") //typ muss gültig sein
            );

          notify.importSuccessful(translate);
          await saveImportedTransactionsToDB(importedRows);
          notify.dataSaved(translate);
          //formular leeren, damit dieselbe datei ggf. erneut gewählt werden kann
          formElement.reset();
        },

        //falls beim lesen/parsen der datei fehler passiert
        error: (parseError) => {
          console.error(parseError);

          notify.importFailedCantReadData(translate);
        },
      });
    } catch (error) {
      console.error(error);

      notify.importFailed(translate);
    }
  }

  return (
    <Wrapper>
      <Row>
        {/* export button: startet den csv download aus vorhandenen frontend-daten */}
        <TinyButton type="button" onClick={handleExport} data-tour="csv-export">
          {translate("csv.export")}
        </TinyButton>
        {/* import formular: datei wählen und auto-submit durch onChange */}
        <form onSubmit={handleImportSubmit}>
          <VisuallyHiddenInput
            type="file"
            id="csvFile" //fürs label
            name="csvFile" //name im formdata
            accept=".csv,text/csv" //nur csv erlauben
            onChange={(event) => event.currentTarget.form?.requestSubmit()} //direkt abschicken
          />
          <TinyButton as="label" htmlFor="csvFile" data-tour="csv-export">
            {translate("csv.import")}
          </TinyButton>
        </form>
      </Row>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 560px;
  width: 100%;
  margin-bottom: calc(88px + env(safe-area-inset-bottom));
`;
const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`;

const TinyButton = styled.button`
  display: flex;
  justify-content: space-evenly;
  gap: 6px;
  padding: 8px;
  border-radius: 25px;
  background: var(--surface, #f7f9fc);
  box-shadow: inset 0 0 0 1px var(--pb-200, #b3dcff);
  font-size: 12px;
  font-weight: 500;
  color: var(--foreground);
  cursor: pointer;
  text-underline-offset: 2px;
  transition: color 120ms ease-in-out;
  &:hover {
    color: var(--pb-600);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const VisuallyHiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;
