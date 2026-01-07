import type { ConfiguratorData, ConfiguratorQuote, ConfiguratorSelection } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const fetchConfiguratorData = async (): Promise<ConfiguratorData> => {
  const response = await fetch(`${API_URL}/api/configurator/options`);
  if (!response.ok) {
    throw new Error('Unable to load configurator data');
  }
  return response.json();
};

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
