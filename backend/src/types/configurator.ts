export type AirtableRecord<T> = {
  id: string;
  fields: T;
};

export type AirtableListResponse<T> = {
  records: AirtableRecord<T>[];
};

export type ProductRecord = {
  Name: string;
  Category: 'Headunit' | 'Interface' | 'Camera' | 'Accessory';
  Price: number;
  Description?: string;
  ImageUrl?: string;
  CompatibleModels?: string[];
};

export type ConfiguratorOption = {
  id: string;
  name: string;
  category: ProductRecord['Category'];
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
