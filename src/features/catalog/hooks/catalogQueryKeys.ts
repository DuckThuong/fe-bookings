import type {
  ClientCompanyTripQueryDto,
  ClientRoadQueryDto,
} from "@/api/dtos/client-catalog.dto";

export const catalogQueryKeys = {
  all: ["catalog"] as const,
  roads: (filters: ClientRoadQueryDto) => ["catalog", "roads", filters] as const,
  companyTrips: (filters: ClientCompanyTripQueryDto) =>
    ["catalog", "companyTrips", filters] as const,
  companyTrip: (id: number | string) => ["catalog", "companyTrip", id] as const,
};
