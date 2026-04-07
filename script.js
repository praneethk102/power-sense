async function loadData() {
  try {
    const res = await fetch('data.json');
    const json = await res.json();

    const today = json.today;
    const yesterday = json.yesterday;

    // Fetch weather
    const weather = await fetchWeather();
    today.weather = weather.condition;

    // UI updates
    document.getElementById("lastUpdated").innerText =
      "Last Updated: " + today.date;

    document.getElementById("weatherUI").innerText =
      `Weather: ${weather.condition} | ${weather.temp}°C`;

    renderChart(today);
    renderInsight(today, yesterday);
    renderComparison(today, yesterday);

  } catch (err) {
    console.error(err);
    document.getElementById("insight").innerText =
      "Error loading data";
  }
}


// Chart
function renderChart(data) {
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
}


// Weather API
async function fetchWeather() {
  const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // replace

  const url = `https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  const condition = data.weather[0].main.toLowerCase();
  const temp = Math.round(data.main.temp);

  let mapped = "normal";

  if (condition.includes("cloud")) mapped = "cloudy";
  else if (condition.includes("rain")) mapped = "rainy";
  else if (condition.includes("clear")) mapped = "sunny";

  return { condition: mapped, temp };
}


// Insight
function renderInsight(today, yesterday) {
  let insights = [];

  if (today.solar < yesterday.solar) {
    if (today.weather === "cloudy") {
      insights.push("Solar dropped due to cloudy weather");
    } else {
      insights.push("Solar output decreased");
    }
  }

  if (today.coal > yesterday.coal) {
    insights.push("Coal usage increased (higher demand)");
  }

  if (today.wind > yesterday.wind) {
    insights.push("Wind energy improved");
  }

  if (insights.length === 0) {
    insights.push("Energy mix is stable");
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


loadData();