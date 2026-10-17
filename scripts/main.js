import { fetchLocalStorageRecords, saveRecordsLocally, storeSeedRecordsLocally } from "./storage.js";
import { validateRecord } from "./validators.js";
import { displayRecords } from "./displayRecords.js";
import { debounce, regexBookMatches } from "./search.js";
import { sortByDate, sortByRating, sortBySummary } from "./sortRecords.js";
import { readImportFile, importRecords, exportRecords } from "./importExport.js";

const recordsTable = document.getElementById("records-table");

let allRecords = [];
let editingId = null;

const loadRecords = async () => {
  await storeSeedRecordsLocally();
  allRecords = fetchLocalStorageRecords();
  displayRecords(allRecords, null);
}

loadRecords();

//these are dom elements [specific to the dialog] that are attached event listeners to
const dialog = document.getElementById("form-container");
const openButton = document.getElementById("addNewButton");
const closeButton = document.getElementById("cancelButton");
const form = document.getElementById("addRecordForm");

openButton.addEventListener("click", () => dialog.showModal());

closeButton.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

const dialogTitle = document.getElementById("dialogTitle")
const submitButton = document.getElementById("submitButton");

dialog.addEventListener("close", () => {
  editingId = null;
  form.reset();
  dialogTitle.textContent = "Add Record";
  submitButton.textContent = "Add Record";
});

//this event listener listens for a click on either buttons and calls corresponding function
recordsTable.querySelector("tbody").addEventListener("click", (e) => {
  const button = e.target.closest("button[data-id]");
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.action === "edit") editRecord(id);
  if (button.dataset.action === "delete") deleteRecord(id);
});

//here we listen for the submit event and get records w spaces trimmed,
// validate records per corresponding regexes and save them locally
form.addEventListener("submit", (e) => {
  e.preventDefault();

const values = {
  title: form.elements["title"].value.trim(),
  author: form.elements["author"].value.trim(),
  genre: form.elements["genre"].value.trim(),
  year: form.elements["year"].value.trim(),
  status: form.elements["status"].value,
  rating: form.elements["rating"].value.trim(),
  summary: form.elements["summary"].value.trim(),
  tags: form.elements["tags"].value.trim(),
  notes: form.elements["notes"].value.trim(),
  type: form.elements["type"].value,
  pages: form.elements["pages"].value.trim(),
}

  const error = validateRecord(values);

  if (error) {
    return alert(error)
  }

  const newRecord = {
    ...values,
    tags: values.tags.split(",").map((tag) => tag.trim()),
    notes: [{ text: values.notes}]
  };

  const records = fetchLocalStorageRecords();

  //if it is a rec we are editing, the edited version replaces the existing/old version in local storage
  if (editingId) {
    const index = records.findIndex((record) => record.id === editingId);
    records[index] = { ...records[index], ...newRecord };
  }else{
  records.push({
    id: Date.now(),
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    ...newRecord,
  });
}
  saveRecordsLocally(records);
  loadRecords();
  form.reset();
  dialog.close();
});

//this is the function called when we click edit button. it immediately finds record locally by id,
//then populates its data in the form for editing
const editRecord = (id) => {
  const record = fetchLocalStorageRecords().find((record) => record.id === id);
  if (!record) {
    return;
  }
  [
    "title",
    "author",
    "genre",
    "year",
    "status",
    "rating",
    "summary",
    "type",
    "pages"
  ].forEach((name) => (form.elements[name].value = record[name]));
  form.elements["tags"].value = record.tags.join(", ");
  form.elements["notes"].value = record.notes
    .map((note) => note.text)
    .join("; ");

  editingId = id;
  dialogTitle.textContent = "Edit Record";
  submitButton.textContent = "Save Changes";
  dialog.showModal();
};

//this is the function that get called when delete button is clicked
const deleteRecord = (id) => {
  if (!confirm("Delete this record?")) {
    return;
  }
  const records = fetchLocalStorageRecords().filter(
    (record) => record.id !== id,
  );
  saveRecordsLocally(records);
  loadRecords();
};

//here, file import elements are attached event listeners to to trigger corresponding functionality
//importFile listens for a file upload then calls importRecords on a successful file parsing
//import button listens for a click on the file input field then triggers its opening
const importFile = document.getElementById("importFile");

const importButton = document.getElementById("importButton");
importButton.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;

  readImportFile(file, (data) => {
    importRecords(data);
    loadRecords();
  });
});

const exportButton = document.getElementById("exportButton");
exportButton.addEventListener("click", exportRecords);

//sortByDateAdedButton listens for a click event and triggers sort function on the records in date column
const sortByDateAddedButton = document.getElementById("sortByDate");
sortByDateAddedButton.addEventListener("click", () => {
  allRecords.sort(sortByDate);
  displayRecords(allRecords, null);
});

//sortBySummaryButton listens for a click event and calls sort function on records in summary col
//sorting is in asc order [A-Z]

const sortBySummaryButton = document.getElementById("sortBySummary");
sortBySummaryButton.addEventListener("click", () => {
  allRecords.sort(sortBySummary);
  displayRecords(allRecords, null);
});

//sortByRatingButton listens for a click event too and triggers sort on rating column. 
//records are sorted in desc order
const sortByRatingButton = document.getElementById("sortByRating");
sortByRatingButton.addEventListener("click", () => {
  allRecords.sort(sortByRating);
  displayRecords(allRecords, null);
});

//dom elements relative to searching
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const caseSnstvToggle = document.getElementById("caseSnstvToggle");
const searchStatus = document.getElementById("searchStatus");

//doSearch calls all our functions and does the actual search and returns the filtered records per search. the pattern here is what the user inputs
//regex depends on where case sensitivity was chosen or not
const doSearch = () => {
  const pattern = searchInput.value;

  if (pattern === "") {
    searchInput.removeAttribute("aria-invalid");
    displayRecords(allRecords, null);
    searchStatus.textContent = `${allRecords.length} records.`;
    return;
  }
  let regex = "";
  try {
    regex = new RegExp(pattern, caseSnstvToggle.checked ? "gi" : "g");
  } catch (error) {
    searchInput.setAttribute("aria-invalid", "true");
    searchStatus.textContent = `Invalid pattern: ${error.message}`;
    return;
  }

  searchInput.removeAttribute("aria-invalid");
  const matches = allRecords.filter((record) => regexBookMatches(record, regex));
  displayRecords(matches, regex);
  searchStatus.textContent = `${matches.length} of ${allRecords.length} match`;
};

//searchInput listens for user input and executes doSearch after the set time
searchInput.addEventListener("input", debounce(doSearch, 300));
//searchButton listens for a click event and automatically calls doSearch
searchButton.addEventListener("click", doSearch);
//the case sensitivity toggle element listens for change and updates pattern accordingly
caseSnstvToggle.addEventListener("change", doSearch);