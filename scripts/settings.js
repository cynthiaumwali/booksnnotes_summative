import { toggleNavbar } from "./toggleNavbar.js";
import { fetchLocalStorageRecords, getCap, saveCap } from "./storage.js";

const PPH_KEY = "booksnnotes_pph";
const UNIT_KEY = "booksnnotes_unit";

const capInput = document.getElementById("capInput");
const capStatus = document.getElementById("capStatus");
const pagesPerHour = document.getElementById("pagesPerHour");
const timeUnits = document.getElementById("timeUnits");
const convertPages = document.getElementById("convertPages");
const convertResults = document.getElementById("convertResult");
const readingTime = document.getElementById("readingTime");
const settingsStatus = document.getElementById("settingsStatus");

const pagesToTime = (pages, pagesPerHour, unit) => {
    const minutes = (pages / pagesPerHour) * 60;
    return unit === "hours" ? `${(minutes / 60).toFixed(1)} hours` : `${Math.round(minutes)} minutes`; 
};

const getSpeed = () => Number(pagesPerHour.value) || 30;

const updateResults = () => {
    const unit = timeUnits.value;
    const pages = Number(convertPages.value);
    convertResults.textContent = convertPages.value === "" ? "" : `${pages} pages is about ${pagesToTime(pages, getSpeed(), unit)} of reading.`;
    
    const totalPages = fetchLocalStorageRecords().reduce(
        (sum, record) => sum + (Number(record.pages) || 0),
        0
    )
    readingTime.textContent = `The vault of (${totalPages} pages) is about ${pagesToTime(totalPages, getSpeed(), unit)}.`;
}

const updateCapStatus = () => {
    const cap = getCap()
    const totalPages = fetchLocalStorageRecords().reduce(
    (sum, record) => sum + (Number(record.pages) || 0),
    0
    );
    if (!cap) {
        capStatus.setAttribute("aria-live", "polite");
        capStatus.textContent = "No page cap set."
    }else if (totalPages > cap) {
        capStatus.setAttribute("aria-live", "assertive");
        capStatus.textContent = `Over your cap by ${totalPages - cap} pages.`;
    }else {
        capStatus.setAttribute("aria-live", "polite");
        capStatus.textContent = `${cap - totalPages} pages remaining under your cap.`;
    }
}

capInput.value = getCap() || "";
pagesPerHour.value = localStorage.getItem(PPH_KEY) || 30;
timeUnits.value = localStorage.getItem(UNIT_KEY) || "minutes";

capInput.addEventListener("change", () => {
    saveCap(Math.max(0, Number(capInput.value) || 0));
    updateCapStatus()
    settingsStatus.textContent = "Page cap saved";
});

pagesPerHour.addEventListener("change", () => {
    localStorage.setItem(PPH_KEY, getSpeed());
    updateResults()
    settingsStatus.textContent = "Reading speed saved.";
});

timeUnits.addEventListener("change", () => {
    localStorage.setItem(UNIT_KEY, timeUnits.value);
    updateResults()
    settingsStatus.textContent = `Reading time will be shown in ${timeUnits.value}.`;
});

convertPages.addEventListener("input", updateResults);
updateCapStatus();
updateResults();
toggleNavbar();
