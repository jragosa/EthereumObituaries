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

// Info icon tooltip functionality
document.addEventListener('DOMContentLoaded', function() {
    const infoIcon = document.querySelector('.info-icon');
    const infoTooltip = document.getElementById('info-tooltip');

    if (infoIcon && infoTooltip) {
        infoIcon.addEventListener('mouseenter', function(e) {
            infoTooltip.style.display = 'block';
            const iconRect = infoIcon.getBoundingClientRect();
            infoTooltip.style.left = `${iconRect.right + 10}px`;
            infoTooltip.style.top = `${iconRect.top - 5}px`;
        });

        infoIcon.addEventListener('mouseleave', function() {
            infoTooltip.style.display = 'none';
        });
    }
});

init();