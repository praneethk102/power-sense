const data = {
  solar: 18,
  wind: 12,
  coal: 60,
  hydro: 7,
  nuclear: 3
};

// Chart
const ctx = document.getElementById('energyChart');

new Chart(ctx, {
  type: 'pie',
  data: {
    labels: Object.keys(data),
    datasets: [{
      data: Object.values(data)
    }]
  }
});

// Insight logic (simple but useful)
let insight = "";

if (data.solar < 20) {
  insight = "Solar output is low today";
} else {
  insight = "Solar output is stable";
}

document.getElementById("insight").innerText = insight;