export const ClientCatalogEndPoints = {
  ROADS: "/client/catalog/roads",
  COMPANY_TRIPS: "/client/catalog/company-trips",
  COMPANY_TRIP_DETAIL: (id: number | string) => `/client/catalog/company-trips/${id}`,
};
