import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const FOLDER_ID = '13pyvkm6Yml7KJyTIt_LXV0VHzUwEfhSt';
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

    // -----------------------------------------------------------------
    // 1. Googleドライブ上の ticker_list.json からスコア情報を取得
    // -----------------------------------------------------------------
    const jsonFile = files.find(f => f.name === 'ticker_list.json');
    const scoreMap = new Map();

    if (jsonFile) {
      try {
        console.log('Fetching ticker_list.json from Google Drive...');
        const jsonUrl = `https://www.googleapis.com/drive/v3/files/${jsonFile.id}?alt=media&key=${API_KEY}`;
        const jsonRes = await fetch(jsonUrl);
        const jsonList = await jsonRes.json();

        if (Array.isArray(jsonList)) {
          for (const item of jsonList) {
            // 4桁の銘柄コードを特定キーにする
            const rawStr = item.ticker_string || item.ticker || item.symbol || '';
            const match = rawStr.match(/\d{4}/);
            if (match) {
              const code = match[0];
              scoreMap.set(code, {
                quality_score: item.quality_score,
                vol_score: item.vol_score,
                depth_score: item.depth_score,
                close_pos_score: item.close_pos_score
              });
            }
          }
          console.log(`Loaded scores for ${scoreMap.size} tickers from ticker_list.json.`);
        }
      } catch (jsonErr) {
        console.warn('Failed to parse ticker_list.json:', jsonErr.message);
      }
    } else {
      console.warn('ticker_list.json not found in Drive folder.');
    }

    // -----------------------------------------------------------------
    // 2. 画像ファイル一覧の解析とスコア情報の結合
    // -----------------------------------------------------------------
    const tickers = [];

    for (const file of files) {
      if (file.name.endsWith('_chart.png')) {
        // Parse filename: Symbol_Market_Name_chart.png
        // Example: [ho]2212_T_山崎製パン_chart.png
        const parts = file.name.split('_');
        if (parts.length >= 3) {
          const symbolStr = parts[0]; // 例: "[ho]2212"
          const codeMatch = symbolStr.match(/\d{4}/);
          const code = codeMatch ? codeMatch[0] : '';

          // ドライブ上の JSON から該当銘柄のスコア情報を取得
          const scores = scoreMap.get(code) || {};

          tickers.push({
            symbol: parts[0],
            market: parts[1],
            name: parts[2],
            id: file.id,
            filename: file.name,
            // ★ スコアプロパティを追加
            quality_score: scores.quality_score ?? null,
            vol_score: scores.vol_score ?? null,
            depth_score: scores.depth_score ?? null,
            close_pos_score: scores.close_pos_score ?? null
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