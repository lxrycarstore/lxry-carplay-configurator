export const matchesYearRange = (
  buildYear: number,
  from?: number | null,
  to?: number | null
): boolean => {
  const start = from ?? -Infinity;
  const end = to ?? Infinity;
  return buildYear >= start && buildYear <= end;
};
