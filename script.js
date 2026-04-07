async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();

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

  let insight = "";

  if (data.coal > 50) {
    insight = "High coal dependency today";
  } else if (data.solar < 20) {
    insight = "Solar output is low today";
  } else {
    insight = "Energy mix is balanced";
  }

  document.getElementById("insight").innerText = insight;
}
document.body.insertAdjacentHTML(
  "beforeend",
  `<p>Data Date: ${data.date}</p>`
);

loadData();