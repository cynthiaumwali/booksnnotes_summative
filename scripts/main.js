import { regexPatterns } from "./regexPatterns.js";
const recordsTable = document.getElementById("records-table");

let allRecords = []

const fetchRecords = async () => {
  try {
    const response = await fetch("../seed.json");
    const seedRecords = await response.json();
    allRecords = [...seedRecords, ...fetchLocalStorageRecords()];
    allRecords.forEach((record) => {
      const noteText = record.notes.map((note) => note.text).join("; ");
      const row = document.createElement("tr");
      row.innerHTML = `<td>${record.title}</td>
      <td>${record.author}</td>
      <td>${record.dateAdded}</td>
      <td>${record.summary}</td>
        <td>${record.tags}</td>
        <td>${record.rating}</td>
        <td>${noteText}</td>
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

const STORAGE_KEY = "booksnnotes_records";

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

  if (!regexPatterns.title.test(title)) return alert("Invalid title");
  if (!regexPatterns.author.test(author)) return alert("Invalid author");
  if (!regexPatterns.genre.test(genre)) return alert("Invalid genre");
  if (!regexPatterns.year.test(year))
    return alert("Year must be between 1500 and 2099");
  if (!regexPatterns.status.test(status)) return alert("Choose a status");
  if (!regexPatterns.rating.test(rating)) return alert("Rating must be 1 to 5");
  if (!regexPatterns.hasALetter.test(summary))
    return alert("Summary must contain at least one letter");
  if (!regexPatterns.tags.test(tags))
    return alert("Tags must be lowercase and comma-separated");
  if (!regexPatterns.text.test(notes))
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

  const records = fetchRecords();
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
  const notesText = record.notes.map((note) => note.text).join("; ");
  if (!regexPatterns.title.test(record.title)) return false;
  if (!regexPatterns.author.test(record.author)) return false;
  if (!regexPatterns.genre.test(record.genre)) return false;
  if (!regexPatterns.year.test(record.year)) return false;
  if (!regexPatterns.status.test(record.status)) return false;
  if (!regexPatterns.rating.test(record.rating)) return false;
  if (!regexPatterns.hasALetter.test(record.summary)) return false;
  if (!regexPatterns.tags.test(record.tags)) return false;
  if (!regexPatterns.text.test(notesText)) return false;
  if (!record.type) return false;
  return true;
};

const importFile = document.getElementById("importFile");

const importButton = document.getElementById("importButton");
importButton.addEventListener("click", () => importFile.click());

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
  reader.onerror = () => alert("We couldn't read that file.");
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
  const dataString = JSON.stringify(records, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataString);
  const exportLink = document.createElement("a");
  exportLink.setAttribute("href", dataUri);
  exportLink.setAttribute("download", "booksnnotes_records.json");
  exportLink.click();
};

const exportButton = document.getElementById("exportButton");
exportButton.addEventListener("click", exportRecords);

const sortByDateAddedButton = document.getElementById("sortByDate");
sortByDateAddedButton.addEventListener("click", () => {
  const tbody = recordsTable.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.sort((a, b) => {
    const aDate = new Date(a.querySelector("td:nth-child(3)").textContent);
    const bDate = new Date(b.querySelector("td:nth-child(3)").textContent);
    return bDate - aDate;
  });
  rows.forEach((row) => tbody.appendChild(row));
});

const sortBySummaryButton = document.getElementById("sortBySummary");
sortBySummaryButton.addEventListener("click", () => {
  const tbody = recordsTable.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.sort((a, b) => {
    const aDscr = a.querySelector("td:nth-child(4)").textContent;
    const bDscr = b.querySelector("td:nth-child(4)").textContent;
    return aDscr.localeCompare(bDscr);
  });
  rows.forEach((row) => tbody.appendChild(row));
});

const sortByRatingButton = document.getElementById("sortByRating");
sortByRatingButton.addEventListener("click", () => {
  const tbody = recordsTable.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.sort((a, b) => {
    const aRtng =
      parseFloat(a.querySelector("td:nth-child(6)").textContent) || 0;
    const bRtng =
      parseFloat(b.querySelector("td:nth-child(6)").textContent) || 0;
    return bRtng - aRtng;
  });
  rows.forEach((row) => tbody.appendChild(row));
});

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const caseSnstvToggle = document.getElementById("caseSnstvToggle");
const searchStatus = document.getElementById("searchStatus");

const escapeHTML = (text) => {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const debounce = (fn, delay) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};


const getRowFields = (record) => {
  return {
    title: record.title,
    author: record.author,
    summary: record.summary,
    tags: record.tags.join(", "),
    notes: record.notes.map((note) => note.text).join("; "),
  };
};

const highlightMatch = (text, regexPattern) => {
  if (!regexPattern) {
    return escapeHTML(text);
  }
  let finalResult = "";
  let end = 0;

  for (const match of text.matchAll(regexPattern)) {
    if (match[0].length === 0) {
      continue;
    }
    finalResult += escapeHTML(text.slice(end, match.index));
    finalResult += `<mark>${escapeHTML(match[0])}</mark>`;
    end = match.index + match[0].length;
  }
  return finalResult + escapeHTML(text.slice(end));
};

const containsMatch = (text, regex) => {
  return [...text.matchAll(regex)].some((match) => match[0].length > 0);
};

const bookMatches = (book, regexPattern) => {
  return Object.values(getRowFields(book)).some((field) =>
    containsMatch(field, regexPattern),
  );
};

const fetchFilteredRecords = (records, regexPattern) => {
  const tbody = recordsTable.querySelector("tbody");
  tbody.innerHTML = "";
  records.forEach((record) => {
    const fields = getRowFields(record);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${highlightMatch(fields.title, regexPattern)}</td>
      <td>${highlightMatch(fields.author, regexPattern)}</td>
      <td>${record.dateAdded}</td>
      <td>${highlightMatch(fields.summary, regexPattern)}</td>
      <td>${highlightMatch(fields.tags, regexPattern)}</td>
      <td>${record.rating}</td>
      <td>${highlightMatch(fields.notes, regexPattern)}</td>
      <td><button>Edit</button></td>
    `;
    tbody.appendChild(row);
  });
};

const doSearch = () => {
  const pattern = searchInput.value;

  if (pattern === "") {
    searchInput.removeAttribute("aria-invalid");
    fetchFilteredRecords(allRecords, null);
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
  const matches = allRecords.filter((record) =>
    bookMatches(record, regex),
  );
  fetchFilteredRecords(matches, regex);
  searchStatus.textContent = `${matches.length} of ${allRecords.length} match`;
};

searchInput.addEventListener("input", debounce(doSearch, 300));
searchButton.addEventListener("click", doSearch);
caseSnstvToggle.addEventListener("change", doSearch);