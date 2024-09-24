async function fetchData() {
  const priceResponse = await fetch('data/ethereum-prices.json');
  const priceData = await priceResponse.json();

  const obituariesResponse = await fetch('data/ethereum-obituaries.json');
  const obituariesData = await obituariesResponse.json(); // Corrected to use obituariesResponse.json()

  return { priceData, obituariesData };
}

async function init() {
  const { priceData, obituariesData } = await fetchData();
  createChart(priceData, obituariesData);
  renderTimeline(obituariesData, priceData);

  // Update the number of obituaries in the sentence
  const obituariesCount = obituariesData.length;
  const countElement = document.querySelector('.obituaries-count');
  countElement.textContent = `${obituariesCount} times`;
}

init();