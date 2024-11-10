const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../data/ethereum-prices.json'); // Update path as per your structure

// Function to read existing JSON data
function readExistingData() {
    if (fs.existsSync(OUTPUT_FILE)) {
        const data = fs.readFileSync(OUTPUT_FILE, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

// Function to calculate the number of days between two dates
function calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end - start;
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
}

// Function to fetch latest Ethereum price data from CoinGecko
async function fetchLatestEthereumPriceData(days) {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart', {
            params: {
                vs_currency: 'usd',
                days: days,
            }
        });
        return response.data.prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toISOString().split('T')[0],
            price: price
        }));
    } catch (error) {
        console.error('Error fetching price data:', error.response ? error.response.data : error.message);
        return [];
    }
}

async function updatePriceData() {
    try {
        // Read existing JSON data
        let existingData = readExistingData();

        // Get the most recent date from existing data
        const mostRecentDate = existingData.length > 0
            ? existingData[existingData.length - 1].date
            : '2015-08-07'; // Ethereum started trading around this date

        // Calculate number of days from most recent date to today
        const todayDate = new Date().toISOString().split('T')[0];
        const days = calculateDaysBetween(mostRecentDate, todayDate);

        // Fetch new data from CoinGecko
        const newData = await fetchLatestEthereumPriceData(days);

        // Combine existing data with new data
        existingData = [
            ...existingData,
            ...newData
        ];

        // Remove duplicates and sort the combined data by date
        const uniqueData = Array.from(new Set(existingData.map(d => d.date)))
            .map(date => existingData.find(d => d.date === date));

        // Ensure consistent formatting
        const formattedData = JSON.stringify(uniqueData, null, 2)
            .replace(/    /g, '  ') // Replace any 4-space indentation with 2-space
            .replace(/\r\n/g, '\n'); // Normalize line endings

        fs.writeFileSync(OUTPUT_FILE, formattedData);
        console.log('Price data updated and saved successfully.');
    } catch (error) {
        console.error('Error updating price data:', error);
    }
}

updatePriceData();