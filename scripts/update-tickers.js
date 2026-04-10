import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const FOLDER_ID = '13pyvkm6Yml7KJyTIt_LXV0VHzUwEfhSt';
// You can set this as an environment variable or paste it here temporarily
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY || ''; 
const OUTPUT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/tickers.js');

async function updateTickers() {
  if (!API_KEY) {
    console.error('Error: GOOGLE_DRIVE_API_KEY is not set.');
    console.log('Please set it in your environment or update the script with your API Key.');
    process.exit(1);
  }

  console.log('Fetching file list from Google Drive...');

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+trashed=false&fields=files(id,name)&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const files = data.files || [];
    const tickers = [];

    for (const file of files) {
      if (file.name.endsWith('_chart.png')) {
        // Parse filename: Symbol_Market_Name_chart.png
        // Example: 166A_T_タスキホールディングス_chart.png
        const parts = file.name.split('_');
        if (parts.length >= 3) {
          tickers.push({
            symbol: parts[0],
            market: parts[1],
            name: parts[2],
            id: file.id,
            filename: file.name
          });
        }
      }
    }

    // Sort by symbol
    tickers.sort((a, b) => a.symbol.localeCompare(b.symbol));

    const fileContent = `export const tickers = ${JSON.stringify(tickers, null, 2)};\n`;
    fs.writeFileSync(OUTPUT_FILE, fileContent);

    console.log(`Successfully updated ${OUTPUT_FILE} with ${tickers.length} tickers.`);
  } catch (error) {
    console.error('Failed to update tickers:', error.message);
  }
}

updateTickers();
