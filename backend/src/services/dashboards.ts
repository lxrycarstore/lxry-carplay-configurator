import { fetchAutoDashboards, fetchDashboardTypes } from './airtable';

export const getDashboardsForModel = async (modelId: string) => {
  const autoDashboards = await fetchAutoDashboards();
  const dashboardTypes = await fetchDashboardTypes();

  // 1️⃣ Alleen dashboards die bij deze auto horen
  const relevant = autoDashboards.filter(
    (row) => row.autoId === modelId
  );

  // 2️⃣ Verrijk met echte dashboard data + foto uit Airtable
  return relevant
    .map((row) => {
      const type = dashboardTypes.find(t => t.id === row.dashboardTypeId);
      if (!type) return null;

      return {
        id: type.id,
        name: type.naam,
        imageUrl: type.herkenningsfoto?.[0]?.url ?? null
      };
    })
    .filter(Boolean);
};
