const STORAGE_KEY = "booksnnotes_records";
const CAP_KEY = "booksnnotes_cap";

//fetchLocalStorageRecords returns records stored in the local storage, using storage key to identify them
export const fetchLocalStorageRecords = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Error storing records",error)
        return []
    }
}

//saveRecordsLocally saves the whole records array to local storage
export const saveRecordsLocally = (records) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// storeSeedRecordsLocally adds seed data to local storage
// but only if there is nothing stored yet
export const storeSeedRecordsLocally = async () => {
    if (localStorage.getItem(STORAGE_KEY) === null) {
        try {
            const response = await fetch('../seed.json');
            const seedRecords = await response.json();
            const toLocalStorage = seedRecords.map((record, i) => ({
                id: Date.now() + i,
                ...record
            }))
            saveRecordsLocally(toLocalStorage);
        } catch (error) {
            console.error("Error storing seed data", error)
        }
    } else {
        return;
    }
}

export const getCap = () => Number(localStorage.getItem(CAP_KEY)) || 0;
export const saveCap = (cap) => localStorage.setItem(CAP_KEY, String(cap));