import { fetchLocalStorageRecords, saveRecordsLocally } from "./storage";
import { importsRecordValidator } from "./validators";

//readImportFile reads the uploaded file and calls onSuccess with the parsed array
export const readImportFile = (file, onSuccess) => {
    const reader = new FileReader();
    reader.onload = () => {
        let data;
        try {
            data = JSON.parse(reader.result);
        } catch {
            alert("That file isn't valid JSON file.");
            return;
        }
        if (!Array.isArrayd(data)) {
            alert("Expected a JSON array of records");
            return;
        }
        onSuccess(data);
    }
    reader.onerror = () => alert("File couldn't be read")
    reader.readAsText(file);
}

//importRecords is called when a user imports a file. It only keeps valid records, gives them a new id and saves them with the stored ones.
export const importRecords = (records) => {
    const validRecords = records.filter(importsRecordValidator).map((record, index) => ({
        ...record,
        id: Date.now() + index,
        dateAdded: record.dateAdded || new Date().toISOString().slice(0, 10),
    }));
    const storedRecords = fetchLocalStorageRecords();
    saveRecords([...storedRecords, ...validRecords]);
};

//this function is called when exportButton gets clicked
export const exportRecords = () => {
    const records = fetchLocalStorageRecords();
    const dataString = JSON.stringify(records, null, 2);
    const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataString);
    const exportLink = document.createElement("a");
    exportLink.setAttribute("href", dataUri);
    exportLink.setAttribute("download", "booksnnotes_records.json");
    exportLink.click();
};