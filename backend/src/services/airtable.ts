import type { AirtableListResponse, ProductRecord } from '../types/configurator.js';

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const fetchProducts = async () => {
  const apiKey = getEnv('AIRTABLE_API_KEY');
  const baseId = getEnv('AIRTABLE_BASE_ID');
  const table = getEnv('AIRTABLE_TABLE');

  const url = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(table)}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Airtable error: ${response.status} ${message}`);
  }

  const data = (await response.json()) as AirtableListResponse<ProductRecord>;
  return data.records;
};
