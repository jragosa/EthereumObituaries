const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// Define the path to the fetch-price-data script
const fetchPriceDataScript = path.join(__dirname, 'fetch-price-data.js');

// Schedule a job to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running fetch-price-data script...');

  exec(`node ${fetchPriceDataScript}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
});

console.log('Scheduler initialized.');