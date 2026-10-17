import { dashboardStatsCards } from "./dashboardCards";
import { fetchLocalStorageRecords } from "./storage";
import { toggleNavbar } from "./toggleNavbar";
allRecords = fetchLocalStorageRecords()
dashboardStatsCards(allRecords);
toggleNavbar();