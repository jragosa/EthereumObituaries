async function fetchData() {
    try {
        const timestamp = new Date().getTime();
        const priceResponse = await fetch(`data/ethereum-prices.json?t=${timestamp}`);
        const priceData = await priceResponse.json();
        console.log('Latest price entry:', priceData[priceData.length - 1]);

        const obituariesResponse = await fetch(`data/ethereum-obituaries.json?t=${timestamp}`);
        const obituariesData = await obituariesResponse.json();

        // Validate data
        if (!Array.isArray(priceData) || priceData.length === 0) {
            console.error('Invalid or empty price data');
            return null;
        }

        return { priceData, obituariesData };
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
        return null;
    }
}

async function init() {
    const data = await fetchData();
    if (!data) {
        console.error('Failed to initialize data');
        return;
    }
    const { priceData, obituariesData } = data;
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