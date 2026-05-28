export const ClientCatalogEndPoints = {
  ROADS: "/client/catalog/roads",
  COMPANY_TRIPS: "/client/catalog/trips",
  COMPANY_TRIP_DETAIL: (id: number | string) =>
    `/client/catalog/trips/${id}`,
};
