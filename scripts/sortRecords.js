//sortByDate srts records on their date added. other date columns can also use this function
//dates are sorted from the newest first
export const sortByDate = (a, b) => {
    return new Date(b.dateAdded) - new Date(a.dateAdded);
};

//SortBySummary sorts records by their summaries, sorting is in asc order [A-Z]
export const sortBySummary = (a, b) => {
    return a.summary.localeCompare(b.summary);
}

//sortByRating sorts records by their ratings, in desc order
export const sortByRating = (a, b) => {
    return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
}
