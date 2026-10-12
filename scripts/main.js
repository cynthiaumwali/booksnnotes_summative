const recordsTable = document.getElementById("records-table");

const fetchRecords = async () => {
  try {
    const response = await fetch("../seed.json");
    const records = await response.json();
    records.forEach((record) => {
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
