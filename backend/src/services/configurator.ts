import {
  fetchAutos,
  fetchAutoDashboards,
  fetchDashboardTypes,
  fetchOplossingen
} from './airtable';

import { matchesYearRange } from './yearRangeHelper';
import type { ConfiguratorModel } from '../types/configurator';



import { fetchProducts } from './airtable';
import type { ConfiguratorData, ConfiguratorOption, ConfiguratorQuote, ConfiguratorSelection } from '../types/configurator';

const demoOptions: ConfiguratorOption[] = [
  {
    id: 'demo-headunit',
    name: 'LXRY Headunit Pro',
    category: 'Headunit',
    price: 1299,
    description: 'High-resolution display with wireless CarPlay.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
  },
  {
    id: 'demo-interface',
    name: 'OEM Integration Interface',
    category: 'Interface',
    price: 599,
    description: 'Retains factory controls and premium sound system.'
  },
  {
    id: 'demo-camera',
    name: 'HD Reverse Camera',
    category: 'Camera',
    price: 249,
    description: 'Night-vision optimized backup camera.'
  },
  {
    id: 'demo-accessory',
    name: 'Wireless Adapter',
    category: 'Accessory',
    price: 149,
    description: 'Adds wireless CarPlay support.'
  }
];

const mapOptions = (records: Awaited<ReturnType<typeof fetchProducts>>) =>
  records.map((record) => ({
    id: record.id,
    name: record.fields.Name,
    category: record.fields.Category,
    price: record.fields.Price,
    description: record.fields.Description,
    imageUrl: record.fields.ImageUrl,
    compatibleModels: record.fields.CompatibleModels
  } satisfies ConfiguratorOption));

export const getConfiguratorData = async (): Promise<ConfiguratorData> => {
  try {
    const records = await fetchProducts();
    return {
      options: mapOptions(records),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Falling back to demo data:', error);
    return {
      options: demoOptions,
      updatedAt: new Date().toISOString()
    };
  }
};

export const calculateQuote = (
  options: ConfiguratorOption[],
  selection: ConfiguratorSelection
): ConfiguratorQuote => {
  const chosen = options.filter((option) => selection.selections.includes(option.id));
  const items = chosen.map((option) => ({
    ...option,
    quantity: 1
  }));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { total, items };
};


export const getConfiguratorModels = async (
  merk?: string,
  bouwjaar?: number
): Promise<ConfiguratorModel[]> => {
  try {
    const autos = await fetchAutos();
    const dashboards = await fetchAutoDashboards();
    const types = await fetchDashboardTypes();
    const oplossingen = await fetchOplossingen();

    const filteredAutos = autos.filter((auto) => {
      if (merk && auto.merk !== merk) return false;
      if (bouwjaar !== undefined) {
        return matchesYearRange(bouwjaar, auto.jaarVan ?? null, auto.jaarTot ?? null);
      }
      return true;
    });

    const models: ConfiguratorModel[] = filteredAutos.map((auto) => ({
      id: auto.id,
      merk: auto.merk,
      model: auto.model,
      generatie: auto.generatie ?? null,
      jaarVan: auto.jaarVan ?? null,
      jaarTot: auto.jaarTot ?? null
    }));

    return models;
  } catch (error) {
    console.warn('Airtable failed, using demo fallback', error);

    // Fallback: derive basic models from demoOptions
    const demoModels: ConfiguratorModel[] = [
      {
        id: 'demo',
        merk: 'Demo',
        model: 'Demo Model',
        generatie: null,
        jaarVan: null,
        jaarTot: null
      }
    ];

    return demoModels;
  }
};

