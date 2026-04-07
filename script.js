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

  // Insight
  let insight = "";
  if (data.coal > 50) {
    insight = "High coal usage today";
  } else if (data.solar < 20) {
    insight = "Solar output is low today";
  } else {
    insight = "Energy mix looks balanced";
  }

  document.getElementById("insight").innerText = insight;

  // Comparison logic (THIS is key)
  let changes = [];

  if (data.coal > yesterday.coal) {
    changes.push("Coal ↑");
  } else if (data.coal < yesterday.coal) {
    changes.push("Coal ↓");
  }

  if (data.solar > yesterday.solar) {
    changes.push("Solar ↑");
  } else if (data.solar < yesterday.solar) {
    changes.push("Solar ↓");
  }

  document.getElementById("comparison").innerText =
    "Change vs Yesterday: " + changes.join(", ");
}

loadData();