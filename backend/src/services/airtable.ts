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

// ----------- Configurator Airtable queries -----------

import {
  AutoRecord,
  AutoDashboardRecord,
  DashboardTypeRecord,
  OplossingRecord
} from '../types/configurator';

export const fetchAutos = async (): Promise<AutoRecord[]> => {
  const records = await fetchTable<any>('Auto');
  return records.map((r) => ({
    id: r.id,
    merk: r.fields['Merk'],
    model: r.fields['Model'],
    generatie: r.fields['Generatie / Type'],
    jaarVan: r.fields['Jaar van'] ?? null,
    jaarTot: r.fields['Jaar tot'] ?? null
  }));
};

export const fetchAutoDashboards = async (): Promise<AutoDashboardRecord[]> => {
  const records = await fetchTable<any>('AutoDashboards');
  return records.map((r) => ({
    id: r.id,
    autoId: r.fields['Auto']?.[0],
    dashboardTypeId: r.fields['DashboardType']?.[0]
  }));
};

export const fetchDashboardTypes = async (): Promise<DashboardTypeRecord[]> => {
  const records = await fetchTable<any>('DashboardTypes');
  return records.map((r) => ({
    id: r.id,
    naam: r.fields['Naam'],
    herkenningsfoto: r.fields['Herkenningsfoto']
  }));
};

export const fetchOplossingen = async (): Promise<OplossingRecord[]> => {
  const records = await fetchTable<any>('Oplossingen');
  return records.map((r) => ({
    id: r.id,
    autoDashboardId: r.fields['AutoDashboard']?.[0],
    type: r.fields['OplossingType'],
    prijs: r.fields['Prijs'],
    afbeelding: r.fields['ProductFoto'],
    omschrijving: r.fields['Omschrijving']
  }));
};
