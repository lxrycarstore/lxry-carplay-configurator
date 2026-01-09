import type { ConfiguratorData, ConfiguratorQuote, ConfiguratorSelection } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// Haalt alle configuratie-opties op
export const fetchConfiguratorData = async (): Promise<ConfiguratorData> => {
  const response = await fetch(`${API_URL}/api/configurator/options`);
  if (!response.ok) {
    throw new Error('Unable to load configurator data');
  }
  return response.json();
};

// Berekent de offerte op basis van selectie
export const fetchQuote = async (selection: ConfiguratorSelection): Promise<ConfiguratorQuote> => {
  const response = await fetch(`${API_URL}/api/configurator/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selection)
  });

  if (!response.ok) {
    throw new Error('Unable to calculate quote');
  }

  const data = await response.json();
  return data.quote as ConfiguratorQuote;
};

// Haalt beschikbare modellen op (nieuw — live uit backend)
export const fetchModels = async () => {
  const response = await fetch(`${API_URL}/api/configurator/models`);
  if (!response.ok) {
    throw new Error('Unable to load models');
  }
  return response.json();
};

export async function fetchDashboards(modelId: string) {
  const res = await fetch(`${API_URL}/api/configurator/dashboards?modelId=${modelId}`);
  if (!res.ok) throw new Error('Failed to load dashboards');
  return res.json();
}


// NIEUW - onderaan toevoegen:
export const fetchSolutions = async (autoId: string, dashboardTypeId: string) => {
  const response = await fetch(
    `${API_URL}/api/configurator/solutions?autoId=${autoId}&dashboardTypeId=${dashboardTypeId}`
  );
  if (!response.ok) {
    throw new Error('Unable to load solutions');
  }
  return response.json();
};


