import { getRowValues } from "./search.js"

const recordsTable = document.getElementById("records-table");

export const escapeHTML = (text) => {
    return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

//this function highlights matches as per regex, returned in <mark> element
export const highlightMatch = (text, regexPattern) => {
    if (!regexPattern) {
        return escapeHTML(text)
    }

    let finalResult = ""
    let end = 0

    for (const match of text.matchAll(regexPattern)) {
        if (match[0].length === 0) {
            continue;
        }
        finalResult += escapeHTML(text.slice(end, match.index));
        finalResult += `<mark>${escapeHTML(match[0])}</mark>`;
        end = match.index + match[0].length;
    }
    return finalResult + escapeHTML(text.slice(end));
}


//displayRecords populates the table with rows of every record in records.
// If there's a regex pattern, the matches are highlighted, else, nothing is highlighted.
export const displayRecords = (records, regexPattern) => {
    const tbody = recordsTable.querySelector("tbody");
    tbody.innerHTML = "";
    records.forEach((record) => {
        const fields = getRowValues(record);
        const row = document.createElement("tr");
        row.innerHTML = `<td>${highlightMatch(fields.title, regexPattern)}</td>
        <td>${highlightMatch(fields.author, regexPattern)}</td>
        <td>${escapeHTML(record.createdAt)}</td>
        <td>${highlightMatch(fields.summary, regexPattern)}</td>
        <td>${highlightMatch(fields.tags, regexPattern)}</td>
        <td>${escapeHTML(record.rating)}</td>
        <td>${highlightMatch(fields.notes, regexPattern)}</td>
        <td class="action-buttons">
            <button class="editButton" data-action="edit" data-id="${record.id}" title="Edit" aria-label="Edit ${escapeHTML(record.title)}">&#128393;</button>
            <button class="deleteButton" data-action="delete" data-id="${record.id}" title="Delete" aria-label="Delete ${escapeHTML(record.title)}">&#128465;</button>
        </td>`;
        tbody.appendChild(row);
    })
}