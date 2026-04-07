async function loadData() {
  const res = await fetch('data.json');
  const json = await res.json();

  const data = json.today;
  const yesterday = json.yesterday;

  // Chart
  const ctx = document.getElementById('energyChart');

  new Chart(ctx, {
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

  // Last updated
  document.getElementById("lastUpdated").innerText =
    "Last Updated: " + data.date;

  // Insight generation
  const insightText = generateInsight(data, yesterday);
  document.getElementById("insight").innerText = insightText;

  // Comparison
  let changes = [];

  if (data.coal > yesterday.coal) changes.push("Coal ↑");
  else if (data.coal < yesterday.coal) changes.push("Coal ↓");

  if (data.solar > yesterday.solar) changes.push("Solar ↑");
  else if (data.solar < yesterday.solar) changes.push("Solar ↓");

  if (data.wind > yesterday.wind) changes.push("Wind ↑");
  else if (data.wind < yesterday.wind) changes.push("Wind ↓");

  document.getElementById("comparison").innerText =
    "Change vs Yesterday: " + changes.join(", ");
}


// Intelligence logic
function generateInsight(today, yesterday) {
  let insights = [];

  // Solar reasoning
  if (today.solar < yesterday.solar) {
    if (today.weather === "cloudy") {
      insights.push("Solar dropped due to cloudy weather");
    } else {
      insights.push("Solar output decreased");
    }
  }

  // Coal reasoning
  if (today.coal > yesterday.coal) {
    if (today.demand === "high") {
      insights.push("Coal increased due to high demand");
    } else {
      insights.push("Coal usage increased");
    }
  }

  // Wind reasoning
  if (today.wind > yesterday.wind) {
    insights.push("Wind energy improved today");
  }

  if (insights.length === 0) {
    return "Energy mix is stable today";
  }

  return insights.join(" | ");
}

loadData();