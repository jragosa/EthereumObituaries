function renderTimeline(obituariesData, priceData) {
    const timelineContainer = document.getElementById('timeline');
    // Sort by date in descending order for reverse chronological order
    obituariesData.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentYear = null;
    let yearCounts = {};

    // First, count obituaries per year
    obituariesData.forEach(obituary => {
        let entryYear = new Date(obituary.date).getFullYear();

        // Hardcode dates for the specific entries
        if (obituary.statement === "Sidechains: the coming death of altcoins and ethereum.") {
            entryYear = 2014;
        }
        if (obituary.statement === "Why Ethereum is dead in the water.") {
            entryYear = 2014;
        }

        yearCounts[entryYear] = (yearCounts[entryYear] || 0) + 1;
    });


    // Remove existing year sections and entries before appending new ones
    while (timelineContainer.firstChild) {
        timelineContainer.removeChild(timelineContainer.firstChild);
    }

    // Adjust the background line height dynamically based on the content
    const backgroundLine = document.createElement('div');
    backgroundLine.className = 'timeline-background-line';
    backgroundLine.style.height = '100%';
    timelineContainer.appendChild(backgroundLine);

    obituariesData.forEach((obituary, index) => {
        let displayDate = obituary.date;
        let entryYear = new Date(obituary.date).getFullYear();

        // Hardcode dates for the specific entries
        if (obituary.statement === "Sidechains: the coming death of altcoins and ethereum.") {
            displayDate = "2014-04-09";
            entryYear = 2014;
        }
        if (obituary.statement === "Why Ethereum is dead in the water.") {
            displayDate = "2014-10-15";
            entryYear = 2014;
        }

        // Add year title if it's the first entry of the year
        if (entryYear !== currentYear) {
            currentYear = entryYear;
            const yearTitle = document.createElement('div');
            yearTitle.className = 'timeline-year';
            const deathCount = yearCounts[entryYear];
            const deathText = deathCount === 1 ? 'time' : 'times';
            yearTitle.innerHTML = `${entryYear} <span class="year-count">(ETH died ${deathCount} ${deathText})</span>`;
            yearTitle.id = `year-${entryYear}`; // Assign ID
            timelineContainer.appendChild(yearTitle);
        }

        const entry = document.createElement('div');
        entry.className = 'timeline-entry';

        const date = document.createElement('div');
        date.className = 'timeline-date';
        date.textContent = new Date(displayDate).toISOString().split('T')[0]; // Display the hardcoded or regular date

        const statement = document.createElement('div');
        statement.className = 'timeline-statement';

        const statementLink = document.createElement('a');
        statementLink.href = obituary.link;
        statementLink.target = '_blank';
        statementLink.textContent = obituary.statement;
        statementLink.title = 'View Source';
        statement.appendChild(statementLink);
        if (!obituary.isWebpageUp) {
            const skullEmoji = document.createElement('span');
            skullEmoji.textContent = '💀 ';
            skullEmoji.title = "The website died or the author deleted the post before we could archive it.\nEthereum: 1 / Doomsayer: 0.";
            skullEmoji.className = 'skull-emoji';
            statement.appendChild(skullEmoji);
        }

        const authorSourceContainer = document.createElement('div');
        authorSourceContainer.className = 'author-source-container';

        const author = document.createElement('span');
        author.className = 'timeline-author';
        author.textContent = ` — ${obituary.author}`;

        const source = document.createElement('span');
        source.className = 'timeline-source';
        source.textContent = ` (${obituary.source})`;

        const priceEntry = priceData.find(p => p.date === obituary.date);
        const price = document.createElement('div');
        price.className = 'timeline-price';
        price.textContent = priceEntry ? `$${priceEntry.price.toFixed(2)} ETH` : 'N/A';

        statement.appendChild(statementLink);
        authorSourceContainer.appendChild(author);
        authorSourceContainer.appendChild(source);
        entry.appendChild(date);
        entry.appendChild(statement);
        entry.appendChild(authorSourceContainer);
        entry.appendChild(price); // Display the price at the top right corner



        timelineContainer.appendChild(entry);
    });
}
