let pieChart, trendChart;

async function loadData(days = 7) {
  const res = await fetch('data.json');
  const json = await res.json();

  const allData = json.data;

  const filtered = allData.slice(-days);

  const todayRaw = filtered[filtered.length - 1];
  const yesterdayRaw = filtered[filtered.length - 2];

  const today = convertData(todayRaw);
  const yesterday = convertData(yesterdayRaw);

  document.getElementById("lastUpdated").innerText =
    "Last Updated: " + today.date;

  renderSummary(filtered);
  renderPieChart(today);
  renderTrendChart(filtered);

  renderInsight(today, yesterday);
  renderComparison(today, yesterday);
}


// Convert raw → app format
function convertData(d) {
  const solar = Math.round(d.renewable * 0.6);
  const wind = Math.round(d.renewable * 0.4);

  return {
    date: d.date,
    solar,
    wind,
    coal: d.thermal,
    hydro: d.hydro,
    nuclear: d.nuclear
  };
}


// Summary
function renderSummary(data) {
  let total = 0;

  data.forEach(d => {
    total += d.thermal + d.renewable + d.hydro + d.nuclear;
  });

  const avg = Math.round(total / data.length);

  document.getElementById("summary").innerText =
    `Total: ${total} MU | Avg/day: ${avg} MU`;
}


// PIE
function renderPieChart(data) {
  if (pieChart) pieChart.destroy();

  const ctx = document.getElementById('energyChart');

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Solar', 'Wind', 'Coal', 'Hydro', 'Nuclear'],
      datasets: [{
        data: [
          data.solar,
          data.wind,
          data.coal,
          data.hydro,
          data.nuclear
        ]
      }]
    }
  });
}


// BAR TREND
function renderTrendChart(data) {
  if (trendChart) trendChart.destroy();

  const labels = data.map(d => d.date);

  const coal = data.map(d => d.thermal);
  const renewable = data.map(d => d.renewable);
  const hydro = data.map(d => d.hydro);
  const nuclear = data.map(d => d.nuclear);

  const ctx = document.getElementById('trendChart');

  trendChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Coal', data: coal },
        { label: 'Renewable', data: renewable },
        { label: 'Hydro', data: hydro },
        { label: 'Nuclear', data: nuclear }
      ]
    }
  });
}


// Insight
function renderInsight(today, yesterday) {
  let insights = [];

  if (today.coal > yesterday.coal) {
    insights.push("Demand increased → coal usage up");
  }

  if (today.solar < yesterday.solar) {
    insights.push("Solar output decreased");
  }

  if (today.wind > yesterday.wind) {
    insights.push("Wind energy improved");
  }

  if (insights.length === 0) {
    insights.push("Energy usage stable");
  }

  document.getElementById("insight").innerText =
    insights.join(" | ");
}


// Comparison
function renderComparison(today, yesterday) {
  let changes = [];

  if (today.coal > yesterday.coal) changes.push("Coal ↑");
  else if (today.coal < yesterday.coal) changes.push("Coal ↓");

  if (today.solar > yesterday.solar) changes.push("Solar ↑");
  else if (today.solar < yesterday.solar) changes.push("Solar ↓");

  if (today.wind > yesterday.wind) changes.push("Wind ↑");
  else if (today.wind < yesterday.wind) changes.push("Wind ↓");

  document.getElementById("comparison").innerText =
    "Change vs Yesterday: " + changes.join(", ");
}


// Timeframe change
document.getElementById("timeframe").addEventListener("change", (e) => {
  loadData(parseInt(e.target.value));
});


// Initial load
loadData(7);