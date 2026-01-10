// Types definities
export interface AirtableListResponse<T> {
  records: { id: string; fields: T }[];
  offset?: string;
}

export interface ProductRecord {
  id: string;
  fields: {
    Name: string;
    Price: number;
    Category: string;
    Description?: string;
    ImageUrl?: string;
    CompatibleModels?: string[];
  };
}

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

export interface ConfiguratorModel {
  id: string;
  merk: string;
  model: string;
  generatie: string | null;
  jaarVan: number | null;
  jaarTot: number | null;
}

export interface ConfiguratorOption {
  id: string;
  name: string;
  category?: string;
  price: number;
  description?: string;
  imageUrl?: string | null;
  compatibleModels?: string[];
}

export interface ConfiguratorData {
  options: ConfiguratorOption[];
  updatedAt?: string;
}

export interface ConfiguratorSelection {
  selections: string[];
}

export interface ConfiguratorQuote {
  total: number;
  items: Array<ConfiguratorOption & { quantity: number }>;
}