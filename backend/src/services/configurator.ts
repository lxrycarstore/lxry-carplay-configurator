import { fetchProducts } from './airtable.js';
import type { ConfiguratorData, ConfiguratorOption, ConfiguratorQuote, ConfiguratorSelection } from '../types/configurator.js';

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
