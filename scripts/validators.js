import { regexPatterns } from "./regexPatterns.js";

//validateRecord checks one record against the regexes
//it returns an error message if something is wrong, or null if everything is fine

export const validateRecord = (record) => {
    if (!regexPatterns.title.test(record.title)) return "Invalid title";
    if (!regexPatterns.author.test(record.author)) return "Invalid author";
    if (!regexPatterns.genre.test(record.genre)) return "Invalid genre";
    if (!regexPatterns.year.test(record.year)) return "Year must be between 1500 and 2026";
    if (!regexPatterns.status.test(record.status)) return "Choose a status";
    if (!regexPatterns.rating.test(record.rating)) return "Rating must be between 1 and 5";
    if (!regexPatterns.hasALetter.test(record.summary)) return "Summary must have atleast one letter";
    if (!regexPatterns.tags.test(record.tags)) return "Tags must be lowercase and separated with commas";
    if (!regexPatterns.text.test(record.notes)) return "Notes must be btween 6 and 500 characters";
    if (!record.type) return "Choose a book type";
    if (!regexPatterns.page.test(record.pages)) return "Invalid page number";
    return null;
}

//importRecordValidator is only used to validate imported Records via file upload
export const importsRecordValidator = (record) => {
    const tags = Array.isArray(record.tags) ? record.tags.join(",") : record.tags;
    const notesText = (record.notes || []).map((note) => note.text).join("; ");
    return validateRecord({ ...record, tags, notes: notesText }) === null;
}