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
    const title = form.elements["title"].value;
    const author = form.elements["author"].value;
    const genre = form.elements["genre"].value;
    const year = form.elements["year"].value;
    const status = form.elements["status"].value;
    const rating = form.elements["rating"].value;
    const summary = form.elements["summary"].value;
    const tags = form.elements["tags"].value;
    const notes = form.elements["notes"].value;
    const type = form.elements["type"].value;
    const newRecord = { title, author, genre, year, status, rating, summary, tags, notes, type };
    form.reset();
    dialog.close();
    let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    fetchRecords();
    form.reset();
    dialog.close();
});

function fetchLocalStorageRecords() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return []; 
    }
}