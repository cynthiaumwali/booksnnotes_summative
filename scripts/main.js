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
  renderRecords();

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
