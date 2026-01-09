// Types definities
export interface AirtableListResponse<T> {
  records: { id: string; fields: T }[];
  offset?: string;
}

export interface ProductRecord {
  Name: string;
  Price: number;
  Category: string;
}

export interface AutoRecord {
  id: string;
  merk: string;
  model: string;
  generatie: string | null;
  jaarVan: number | null;
  jaarTot: number | null;
}

export interface AutoDashboardRecord {
  id: string;
  autoId: string | null;
  dashboardTypeId: string | null;
}

export interface DashboardTypeRecord {
  id: string;
  naam: string;
  herkenningsfoto: any | null;
}

export interface OplossingRecord {
  id: string;
  autoDashboardId: string | null;
  type: string;
  prijs: number;
  afbeelding: any | null;
  omschrijving: string | null;
}

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
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Airtable error: ${response.status} ${message}`);
  }

  const data = (await response.json()) as AirtableListResponse<ProductRecord>;
  return data.records;
};

// ---------- Generic helper for new configurator tables ----------

const fetchTable = async <T>(tableName: string) => {
  const apiKey = getEnv('AIRTABLE_API_KEY');
  const baseId = getEnv('AIRTABLE_BASE_ID');

  const url = `${AIRTABLE_API_URL}/${baseId}/${encodeURIComponent(tableName)}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Airtable error in table ${tableName}: ${response.status} ${message}`);
  }

  const data = await response.json();
  return data.records as { id: string; fields: any }[];
};

// ---------- Configurator-specific queries ----------

export const fetchAutos = async (): Promise<AutoRecord[]> => {
  const records = await fetchTable<any>('Auto');
  return records.map((r) => ({
    id: r.id,
    merk: r.fields['Merk'],
    model: r.fields['Model'],
    generatie: r.fields['Generatie / Type'] ?? null,
    jaarVan: r.fields['Jaar van'] ?? null,
    jaarTot: r.fields['Jaar tot'] ?? null
  }));
};

export const fetchAutoDashboards = async (): Promise<AutoDashboardRecord[]> => {
  const records = await fetchTable<any>('AutoDashboards');
  return records.map((r) => ({
    id: r.id,
    autoId: r.fields['Auto']?.[0] ?? null,
    dashboardTypeId: r.fields['DashboardType']?.[0] ?? null
  }));
};

export const fetchDashboardTypes = async (): Promise<DashboardTypeRecord[]> => {
  const records = await fetchTable<any>('DashboardTypes');
  return records.map((r) => ({
    id: r.id,
    naam: r.fields['Naam'],
    herkenningsfoto: r.fields['Herkenningsfoto'] ?? null
  }));
};

export const fetchOplossingen = async (): Promise<OplossingRecord[]> => {
  const records = await fetchTable<any>('Oplossingen');
  return records.map((r) => ({
    id: r.id,
    autoDashboardId: r.fields['AutoDashboard']?.[0] ?? null,
    type: r.fields['OplossingType'],
    prijs: r.fields['Prijs'],
    afbeelding: r.fields['ProductFoto'] ?? null,
    omschrijving: r.fields['Omschrijving'] ?? null
  }));
};
