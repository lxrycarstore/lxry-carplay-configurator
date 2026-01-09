import {
  fetchAutos,
  fetchAutoDashboards,
  fetchDashboardTypes,
  fetchOplossingen,
  fetchProducts
} from './airtable';

import { matchesYearRange } from './yearRangeHelper';

import type {
  ConfiguratorModel,
  ConfiguratorData,
  ConfiguratorOption,
  ConfiguratorQuote,
  ConfiguratorSelection
} from '../types/configurator';

/* ===========================
   PRODUCTEN / OPTIES
=========================== */

const mapOptions = (records: Awaited<ReturnType<typeof fetchProducts>>) =>
  records.map((record) => ({
    id: record.id,
    name: record.fields.Name,
    category: record.fields.Category,
    price: record.fields.Price,
    description: record.fields.Description,
    imageUrl: record.fields.ImageUrl ?? null,
    compatibleModels: record.fields.CompatibleModels ?? []
  } satisfies ConfiguratorOption));

export const getConfiguratorData = async (): Promise<ConfiguratorData> => {
  const records = await fetchProducts();
  return {
    options: mapOptions(records),
    updatedAt: new Date().toISOString()
  };
};

/* ===========================
   OFFERTE BEREKENING
=========================== */

export const calculateQuote = (
  options: ConfiguratorOption[],
  selection: ConfiguratorSelection
): ConfiguratorQuote => {
  const chosen = options.filter((option) =>
    selection.selections.includes(option.id)
  );

  const items = chosen.map((option) => ({
    ...option,
    quantity: 1
  }));

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return { total, items };
};

/* ===========================
   AUTO / MODEL SELECTIE
=========================== */

export const getConfiguratorModels = async (
  merk?: string,
  bouwjaar?: number
): Promise<ConfiguratorModel[]> => {
  const autos = await fetchAutos();

  const filteredAutos = autos.filter((auto) => {
    if (merk && auto.merk !== merk) return false;
    if (bouwjaar !== undefined) {
      return matchesYearRange(
        bouwjaar,
        auto.jaarVan ?? null,
        auto.jaarTot ?? null
      );
    }
    return true;
  });

  return filteredAutos.map((auto) => ({
    id: auto.id,
    merk: auto.merk,
    model: auto.model,
    generatie: auto.generatie ?? null,
    jaarVan: auto.jaarVan ?? null,
    jaarTot: auto.jaarTot ?? null
  }));
};

/* ===========================
   DASHBOARDS (100% Airtable)
=========================== */

export const getConfiguratorDashboards = async (autoId: string) => {
  const autoDashboards = await fetchAutoDashboards();
  const dashboardTypes = await fetchDashboardTypes();

  const linked = autoDashboards.filter((ad) => ad.autoId === autoId);

  return linked
    .map((link) => {
      const type = dashboardTypes.find((t) => t.id === link.dashboardTypeId);
      if (!type) return null;
      return {
        id: type.id,
        name: type.naam,
        imageUrl: type.herkenningsfoto?.[0]?.url ?? null
      };
    })
    .filter(Boolean);
};

/* ===========================
   OPLOSSINGEN
=========================== */

export const getConfiguratorSolutions = async (
  autoId: string,
  dashboardTypeId: string
) => {
  const autoDashboards = await fetchAutoDashboards();
  const oplossingen = await fetchOplossingen();

  // Vind de juiste AutoDashboard link
  const autoDashboard = autoDashboards.find(
    (ad) => ad.autoId === autoId && ad.dashboardTypeId === dashboardTypeId
  );

  if (!autoDashboard) return [];

  // Filter oplossingen die bij deze AutoDashboard horen
  return oplossingen
    .filter((opl) => opl.autoDashboardId === autoDashboard.id)
    .map((opl) => ({
      id: opl.id,
      type: opl.type,
      prijs: opl.prijs,
      omschrijving: opl.omschrijving,
      afbeelding: opl.afbeelding?.[0]?.url ?? null
    }));
};