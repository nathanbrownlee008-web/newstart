// ======================
// SUPABASE CONNECTION
// ======================
const SUPABASE_URL = "https://krmmmutcejnzdfupexpv.supabase.co";
const SUPABASE_KEY = "sb_publishable_3NHjMMVw1lai9UNAA-0QZA_sKM21LgD";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ======================
// DOM
// ======================
const content = document.getElementById("content");
const status = document.getElementById("status");
const tabs = document.querySelectorAll(".tabs button");

// ======================
// LOAD DATA
// ======================
async function loadValueBets() {
  status.textContent = "Loading value bets...";

  const { data, error } = await supabase
    .from("value_bets")
    .select("*")
    .order("date_utc", { ascending: false });

  if (error) {
    console.error(error);
    status.textContent = "Error loading value bets";
    return;
  }

  renderCards(data || []);
  status.textContent = "";
}

async function loadBetHistory() {
  status.textContent = "Loading history...";

  const { data, error } = await supabase
    .from("bet_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    status.textContent = "Error loading history";
    return;
  }

  renderCards(data || []);
  status.textContent = "";
}

// ======================
// RENDER
// ======================
function renderCards(rows) {
  content.innerHTML = "";

  if (!rows.length) {
    content.innerHTML = "<p>No data found.</p>";
    return;
  }

  rows.forEach(row => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <strong>${row.home_team || ""} vs ${row.away_team || ""}</strong><br/>
      Pick: ${row.pick || ""}<br/>
      Probability: ${row.probability || ""}<br/>
      Odds: ${row.odds || ""}
    `;

    content.appendChild(card);
  });
}

// ======================
// TAB SWITCHING
// ======================
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (btn.dataset.tab === "value-bets") {
      loadValueBets();
    } else {
      loadBetHistory();
    }
  });
});

// ======================
// INIT
// ======================
loadValueBets();
