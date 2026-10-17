//this functions waits for a set time as delay to execute the search function
export const debounce = (fn, delay) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

//getRowValues gets individual values from a row's records
export const getRowValues = (record) => {
  return {
    title: record.title,
    author: record.author,
    summary: record.summary,
    tags: record.tags.join(", "),
    notes: record.notes.map((note) => note.text).join("; "),
  };
};

export const containsMatch = (text, regex) => {
  return [...text.matchAll(regex)].some((match) => match[0].length > 0);
};

//bookMatches checks if there're matches in a book record as per regex
export const regexBookMatches = (book, regexPattern) => {
  return Object.values(getRowFields(book)).some((field) =>
    containsMatch(field, regexPattern),
  );
};
