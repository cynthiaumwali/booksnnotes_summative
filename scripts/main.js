import { patterns } from "./regexPatterns.js";
const recordsTable = document.getElementById("records-table");

const fetchRecords = async () => {
  try {
    const response = await fetch("../seed.json");
    const seedRecords = await response.json();
    const allRecords = [...seedRecords, ...fetchLocalStorageRecords()];
    allRecords.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${record.title}</td>
      <td>${record.author}</td>
      <td>${record.year}</td>
      <td><button>Edit</button></td>`;
      recordsTable.querySelector("tbody").appendChild(row);
    });
  } catch (error) {
    console.error("Error showing records:", error);
  }
};

fetchRecords();

const dialog = document.getElementById("form-container");
const openButton = document.getElementById("addNewButton");
const closeButton = document.getElementById("cancelButton");
const form = document.getElementById("addRecordForm");

openButton.addEventListener("click", () => dialog.showModal());

closeButton.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

const STORAGE_KEY = "booknnotesvault_records";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = form.elements["title"].value.trim();
  const author = form.elements["author"].value.trim();
  const genre = form.elements["genre"].value.trim();
  const year = form.elements["year"].value.trim();
  const status = form.elements["status"].value;
  const rating = form.elements["rating"].value.trim();
  const summary = form.elements["summary"].value.trim();
  const tags = form.elements["tags"].value.trim();
  const notes = form.elements["notes"].value.trim();
  const type = form.elements["type"].value;

  if (!patterns.title.test(title)) return alert("Invalid title");
  if (!patterns.author.test(author)) return alert("Invalid author");
  if (!patterns.genre.test(genre)) return alert("Invalid genre");
  if (!patterns.year.test(year))
    return alert("Year must be between 1500 and 2099");
  if (!patterns.status.test(status)) return alert("Choose a status");
  if (!patterns.rating.test(rating)) return alert("Rating must be 1 to 5");
  if (!patterns.hasALetter.test(summary))
    return alert("Summary must contain at least one letter");
  if (!patterns.tags.test(tags))
    return alert("Tags must be lowercase and comma-separated");
  if (!patterns.text.test(notes))
    return alert("Notes must be 6 to 500 characters");
  if (!type) return alert("Choose a type");

  const newRecord = {
    title,
    author,
    genre,
    year,
    status,
    rating,
    summary,
    tags,
    notes,
    type,
  };

  const records = getStoredRecords();
  records.push(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  const tbody = recordsTable.querySelector("tbody");
  tbody.innerHTML = "";
  fetchRecords();

  form.reset();
  dialog.close();
});

const fetchLocalStorageRecords = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const recordValidator = (record) => {
  if (!patterns.title.test(record.title)) return false;
  if (!patterns.author.test(record.author)) return false;
  if (!patterns.genre.test(record.genre)) return false;
  if (!patterns.year.test(record.year)) return false;
  if (!patterns.status.test(record.status)) return false;
  if (!patterns.rating.test(record.rating)) return false;
  if (!patterns.hasALetter.test(record.summary)) return false;
  if (!patterns.tags.test(record.tags)) return false;
  if (!patterns.text.test(record.notes)) return false;
  if (!record.type) return false;
  return true;
};

const importFile = document.getElementById("importFile");

document
  .getElementById("importBtn")
  .addEventListener("click", () => importFile.click());

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try {
      data = JSON.parse(reader.result);
    } catch {
      alert("That file isn't valid JSON file.");
      return;
    }
    if (!Array.isArray(data)) {
      alert("Expected a JSON array of records.");
      return;
    }
    importRecords(data);
  };
  reader.onerror = () => alert("Couldn't read that file.");
  reader.readAsText(file);
});

const importRecords = (records) => {
  const validRecords = records.filter(recordValidator);
  const storedRecords = fetchLocalStorageRecords();
  const updatedRecords = [...storedRecords, ...validRecords];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
  fetchRecords();
};

const exportRecords = () => {
  const records = fetchLocalStorageRecords();
  const dataStr = JSON.stringify(records, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportLink = document.createElement("a");
  exportLink.setAttribute("href", dataUri);
  exportLink.setAttribute("download", "booknnotesvault_records.json");
  exportLink.click();
};

const exportButton = document.getElementById("exportBtn");
exportButton.addEventListener("click", exportRecords);
