let pieChart, trendChart, yearChart;

/* =========================
   THEME TOGGLE
========================= */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});

/* =========================
   LOAD DATA
========================= */
async function loadData(days = 7) {
  try {
    const res = await fetch('data.json');
    const json = await res.json();

    const all = json.daily;
    const yearly = json.yearly;

    const data = all.slice(-days);

    const today = convert(data[data.length - 1]);
    const yesterday = convert(data[data.length - 2]);

    document.getElementById("lastUpdated").innerText =
      "Updated: " + today.date;

    renderSummary(data);
    renderPie(today);
    renderTrend(data);
    renderYear(yearly);
    renderInsight(today, yesterday);

  } catch (err) {
    console.error("Error loading data:", err);
  }
}

/* =========================
   DATA CONVERSION
========================= */
function convert(d) {
  return {
    date: d.date,
    solar: Math.round(d.renewable * 0.6),
    wind: Math.round(d.renewable * 0.4),
    coal: d.thermal,
    hydro: d.hydro,
    nuclear: d.nuclear
  };
}

/* =========================
   SUMMARY
========================= */
function renderSummary(data) {
  let total = data.reduce((sum, d) =>
    sum + d.thermal + d.renewable + d.hydro + d.nuclear, 0);

  document.getElementById("summary").innerText =
    total + " MU total";
}

/* =========================
   PERCENT CALC
========================= */
function percent(arr) {
  let sum = arr.reduce((a, b) => a + b, 0);
  return arr.map(v => ((v / sum) * 100).toFixed(1));
}

/* =========================
   PIE CHART
========================= */
function renderPie(d) {
  if (pieChart) pieChart.destroy();

  let values = [d.solar, d.wind, d.coal, d.hydro, d.nuclear];
  let p = percent(values);

  const ctx = document.getElementById("energyChart");

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: [
        `Solar ${p[0]}%`,
        `Wind ${p[1]}%`,
        `Coal ${p[2]}%`,
        `Hydro ${p[3]}%`,
        `Nuclear ${p[4]}%`
      ],
      datasets: [{
        data: values
      }]
    },
    options: {
      animation: {
        duration: 1000
      }
    }
  });
}

/* =========================
   TREND CHART
========================= */
function renderTrend(data) {
  if (trendChart) trendChart.destroy();

  const ctx = document.getElementById("trendChart");

  trendChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.date),
      datasets: [
        { label: "Coal", data: data.map(d => d.thermal) },
        { label: "Renewable", data: data.map(d => d.renewable) },
        { label: "Hydro", data: data.map(d => d.hydro) },
        { label: "Nuclear", data: data.map(d => d.nuclear) }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000
      }
    }
  });
}

/* =========================
   YEARLY CHART
========================= */
function renderYear(y) {
  if (yearChart) yearChart.destroy();

  let values = y.sources.map(s => s.value);
  let p = percent(values);

  const ctx = document.getElementById("yearChart");

  yearChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: y.sources.map((s, i) => `${s.name} ${p[i]}%`),
      datasets: [{
        label: "Generation (BU)",
        data: values
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000
      }
    }
  });

  document.getElementById("yearSummary").innerText =
    "Total: " + y.total + " BU";
}

/* =========================
   INSIGHTS
========================= */
function renderInsight(today, yesterday) {
  let insights = [];

  if (today.coal > yesterday.coal) {
    insights.push("Demand ↑ → Coal ↑");
  }

  if (today.solar < yesterday.solar) {
    insights.push("Solar ↓");
  }

  if (today.wind > yesterday.wind) {
    insights.push("Wind ↑");
  }

  document.getElementById("insight").innerText =
    insights.join(" | ") || "Stable";
}

/* =========================
   TIMEFRAME CHANGE
========================= */
document.getElementById("timeframe").addEventListener("change", (e) => {
  loadData(parseInt(e.target.value));
});

/* =========================
   INIT
========================= */
loadData(7);