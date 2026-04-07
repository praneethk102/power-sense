async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();

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

  // Last updated time
  document.getElementById("lastUpdated").innerText =
    "Last Updated: " + data.date;

  // Insight logic (keep it simple but meaningful)
  let insight = "";

  if (data.coal > 50) {
    insight = "High coal usage today";
  } else if (data.solar < 20) {
    insight = "Solar output is low today";
  } else {
    insight = "Energy mix looks balanced";
  }

  document.getElementById("insight").innerText = insight;
}

loadData();