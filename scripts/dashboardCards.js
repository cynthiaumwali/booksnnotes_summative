export const dashboardStatsCards = (records) => {
  const totalRecords = document.getElementById("totalRecords");
  const totalPages = document.getElementById("totalPages");
  const topGenre = document.getElementById("topGenre");
  const addedLast7Days = document.getElementById("addedLast7Days");

  totalRecords.textContent = records.length;
  let totPages = 0;
  for (const record of records) {
    totPages += Number(record.pages);
  }

  totalPages.textContent = totPages;

  let topGenreRating = "";
  let topCount = 0;
  for (const record of records) {
    let innerCount = 0;
    for (const rec of records) {
      if (rec.genre === record.genre) {
        innerCount++;
      }
    }
    if (innerCount > topCount) {
        topCount = innerCount;
        topGenreRating = record.genre;
    }
  }

  if (topCount > 0) {
    topGenre.textContent = topGenreRating + " (" + topCount + ")";
  }

  const now = new Date();
  let recentCount = 0;

  for (const record of records) {
    const added = new Date(record.createdAt);
    const daysAgo = (now - added) / (1000 *60*60*24);
    if (daysAgo >= 0 && daysAgo <= 7) {
        recentCount++;
    }
  }

  addedLast7Days.textContent = recentCount;
};
