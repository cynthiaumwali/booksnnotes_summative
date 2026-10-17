//sortByDate srts records on their date added. other date columns can also use this function
//dates are sorted from the newest first
export const sortByDate = (a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
};

//SortBySummary sorts records by their summaries, sorting is in asc order [A-Z]
export const sortBySummary = (a, b) => {
    return a.summary.localeCompare(b.summary);
}

//sortByRating sorts records by their ratings, in desc order
export const sortByRating = (a, b) => {
    return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
}

export const sortRecords = (records, key, dir = 1) => {
    const sorted = [...records];

    sorted.sort((a,b) => {
        let result;
        if (key === "title") {
            result = a.title.localeCompare(b.title);
        }else if (key === "createdAt") {
            result = new Date(a.createdAt) - new Date(b.createdAt);
        }else {
            result = Number(a[key]) - Number(b[key]);
        }

        return result * dir;
    })

    return sorted;
};