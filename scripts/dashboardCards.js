export const dashboardStatsCards = (records) => {
  const totalRecords = document.getElementById("totalRecords");
  const totalRatings = document.getElementById("totalRatings");
  const topGenre = document.getElementById("topGenre");
  const addedLast7Days = document.getElementById("addedLast7Days");

  totalRecords.textContent = records.length;
  let totRatings = 0;
  for (const record of records) {
    totRatings += Number(record.rating);
  }

  totalRatings.textContent = totRatings;

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
    const added = new Date(record.dateAdded);
    const daysAgo = (now - added) / (1000 *60*60*24);
    if (daysAgo >= 0 && daysAgo <= 7) {
        recentCount++;
    }
  }

  addedLast7Days.textContent = recentCount;
};
