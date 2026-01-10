import type {
  ProductRecord,
  AutoRecord,
  AutoDashboardRecord,
  DashboardTypeRecord,
  OplossingRecord
} from '../types/configurator';

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

/* ======================================================
   GENERIC FETCH HELPER
====================================================== */

const fetchTable = async (tableName: string) => {
  const apiKey = getEnv('AIRTABLE_API_KEY');
  const baseId = getEnv('AIRTABLE_BASE_ID');

  const url = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Airtable error (${tableName}): ${response.status} ${msg}`);
  }

  const data = await response.json() as { records: { id: string; fields: any }[] };
  return data.records as { id: string; fields: any }[];
};

/* ======================================================
   PRODUCTEN / OPLOSSINGEN
====================================================== */

export const fetchProducts = async (): Promise<ProductRecord[]> => {
  const table = getEnv('AIRTABLE_OPLOSSINGEN_TABLE');
  const records = await fetchTable(table);

  return records.map(r => ({
    id: r.id,
    fields: r.fields
  }));
};

/* ======================================================
   AUTO
====================================================== */

export const fetchAutos = async (): Promise<AutoRecord[]> => {
  const table = getEnv('AIRTABLE_AUTO_TABLE');
  const records = await fetchTable(table);

  return records.map(r => ({
    id: r.id,
    merk: r.fields['Merk'],
    model: r.fields['Model'],
    generatie: r.fields['Generatie / Type'] ?? null,
    jaarVan: r.fields['Jaar van'] ?? null,
    jaarTot: r.fields['Jaar tot'] ?? null
  }));
};

/* ======================================================
   AUTO → DASHBOARDS
====================================================== */

export const fetchAutoDashboards = async (): Promise<AutoDashboardRecord[]> => {
  const table = getEnv('AIRTABLE_AUTODASHBOARDS_TABLE');
  const records = await fetchTable(table);

  return records.map(r => ({
    id: r.id,
    autoId: r.fields['Auto']?.[0] ?? null,
    dashboardTypeId: r.fields['DashboardType']?.[0] ?? null
  }));
};

/* ======================================================
   DASHBOARD TYPES
====================================================== */

export const fetchDashboardTypes = async (): Promise<DashboardTypeRecord[]> => {
  const table = getEnv('AIRTABLE_DASHBOARDTYPES_TABLE');
  const records = await fetchTable(table);

  return records.map(r => ({
    id: r.id,
    naam: r.fields['Naam'],
    herkenningsfoto: r.fields['Herkenningsfoto'] ?? null
  }));
};

/* ======================================================
   OPLOSSINGEN
====================================================== */

export const fetchOplossingen = async (): Promise<OplossingRecord[]> => {
  const table = getEnv('AIRTABLE_OPLOSSINGEN_TABLE');
  const records = await fetchTable(table);

  return records.map(r => ({
    id: r.id,
    autoDashboardId: r.fields['AutoDashboard']?.[0] ?? null,
    type: r.fields['OplossingType'],
    prijs: r.fields['Prijs'],
    afbeelding: r.fields['ProductFoto'] ?? null,
    omschrijving: r.fields['Omschrijving'] ?? null
  }));
};
