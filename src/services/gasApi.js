import { GAS_URL } from '../config/constants';

/**
 * Sends selected ticker details to Google Sheets via GAS.
 * @param {Array<{symbol: string, name: string, ticker: string}>} tickerDetails
 * @returns {Promise<Response>}
 */
export const syncTickersToSpreadsheet = async (tickerDetails) => {
  if (!Array.isArray(tickerDetails)) {
    throw new Error('Invalid argument: tickerDetails must be an array');
  }

  const response = await fetch(GAS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tickers: tickerDetails,
      source: 'ChartShapeChecker'
    }),
  });

  return response;
};
