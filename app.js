// ==========================
// SUPABASE CONNECTION
// ==========================
const SUPABASE_URL = "https://krmmmutcejnzdfupexpv.supabase.co";
const SUPABASE_KEY = "sb_publishable_3NHjMMVw1lai9UNAA-0QZA_sKM21LgD";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ==========================
// HELPERS
// ==========================
const $ = (id) => document.getElementById(id);

// ==========================
// STATE
// ==========================
const state = {
  raw: [],
  filtered: [],
  columnsAll: [],
  columns: [],
  sortKey: null,
  sortDir: "asc"
};

// ==========================
// LOAD DATASET
// ==========================
async function loadDataset(slug) {
  $("status").textContent = "Loading from Supabase...";

  // -------------------------
  // BET HISTORY
  // -------------------------
  if (slug === "bet-history") {
    const { data, error } = await supabase
      .from("bet_history")
      .select("*");

    if (error) {
      console.error("History error:", error);
      $("status").textContent = "Error loading history";
      return;
    }

    state.raw = data || [];
    setupColumns();
    $("status").textContent = "Live Supabase history";
    render();
    return;
  }

  // -------------------------
  // VALUE BETS
  // -------------------------
  const { data, error } = await supabase
    .from("value_bets")
    .select("*")
    .order("date_utc", { ascending: false });

  if (error) {
    console.error("Value bets error:", error);
    $("status").textContent = "Error loading value bets";
    return;
  }

  state.raw = data || [];
  setupColumns();
  $("status").textContent = "Live Supabase data";
  render();
}

// ==========================
// SETUP COLUMNS
// ==========================
function setupColumns() {
  state.columnsAll = state.raw.length
    ? Object.keys(state.raw[0])
    : [];

  state.columns = state.columnsAll.slice(0, 8);
  state.sortKey = state.columns[0] || null;
  state.sortDir = "asc";
}

// ==========================
// RENDER TABLE
// ==========================
function render() {
  const container = $("tableContainer");
  if (!container) return;

  if (!state.raw.length) {
    container.innerHTML = "<p>No data found</p>";
    return;
  }

  let html = "<table><thead><tr>";

  state.columns.forEach(col => {
    html += `<th>${col}</th>`;
  });

  html += "</tr></thead><tbody>";

  state.raw.forEach(row => {
    html += "<tr>";
    state.columns.forEach(col => {
      html += `<td>${row[col] ?? ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";

  container.innerHTML = html;
}

// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  loadDataset("value-bets");
});
