import {
  getClientCompanyTrip,
  listClientCompanyTrips,
  listClientRoads,
} from "@/api/configs/client-catalog.config";
import type {
  ClientCompanyTripQueryDto,
  ClientRoadQueryDto,
} from "@/api/dtos/client-catalog.dto";
import { useQuery } from "@tanstack/react-query";
import { catalogQueryKeys } from "./catalogQueryKeys";

export const useClientRoadsQuery = (
  filters: ClientRoadQueryDto,
  enabled = true,
) =>
  useQuery({
    queryKey: catalogQueryKeys.roads(filters),
    queryFn: () => listClientRoads(filters),
    enabled,
  });

export const useClientCompanyTripsQuery = (
  filters: ClientCompanyTripQueryDto,
  enabled = true,
) =>
  useQuery({
    queryKey: catalogQueryKeys.companyTrips(filters),
    queryFn: () => listClientCompanyTrips(filters),
    enabled,
  });

export const useClientCompanyTripQuery = (
  id: number | string,
  enabled = true,
) =>
  useQuery({
    queryKey: catalogQueryKeys.companyTrip(id),
    queryFn: () => getClientCompanyTrip(id),
    enabled: enabled && Boolean(id),
  });
