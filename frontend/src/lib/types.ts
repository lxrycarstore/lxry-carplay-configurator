export type ConfiguratorOption = {
  id: string;
  name: string;
  category: 'Headunit' | 'Interface' | 'Camera' | 'Accessory';
  price: number;
  description?: string;
  imageUrl?: string;
  compatibleModels?: string[];
};

export type ConfiguratorData = {
  options: ConfiguratorOption[];
  updatedAt: string;
};

export type ConfiguratorSelection = {
  model: string;
  selections: string[];
};

export type ConfiguratorQuote = {
  total: number;
  items: Array<ConfiguratorOption & { quantity: number }>;
};
