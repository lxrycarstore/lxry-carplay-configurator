import type { ConfiguratorOption } from './types';

export const groupByCategory = (options: ConfiguratorOption[]) =>
  options.reduce<Record<ConfiguratorOption['category'], ConfiguratorOption[]>>(
    (acc, option) => {
      acc[option.category] = [...(acc[option.category] ?? []), option];
      return acc;
    },
    {
      Headunit: [],
      Interface: [],
      Camera: [],
      Accessory: []
    }
  );

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
