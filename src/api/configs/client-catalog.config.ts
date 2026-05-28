import axiosClient from "../axiosClient";
import type {
  ClientCompanyTripQueryDto,
  ClientPaginatedResponseDto,
  ClientRoadDto,
  ClientRoadQueryDto,
  ClientTripDto,
} from "../dtos/client-catalog.dto";
import { ClientCatalogEndPoints } from "../endpoints/client-catalog.endpoint";

export const listClientRoads = async (
  payload: ClientRoadQueryDto,
): Promise<ClientPaginatedResponseDto<ClientRoadDto>> => {
  const response = await axiosClient.get(ClientCatalogEndPoints.ROADS, {
    params: payload,
  });
  return response.data;
};

export const listClientCompanyTrips = async (
  payload: ClientCompanyTripQueryDto,
): Promise<ClientPaginatedResponseDto<ClientTripDto>> => {
  const response = await axiosClient.get(ClientCatalogEndPoints.COMPANY_TRIPS, {
    params: payload,
  });
  return response.data;
};

export const getClientCompanyTrip = async (
  id: number | string,
): Promise<ClientTripDto> => {
  const response = await axiosClient.get(
    ClientCatalogEndPoints.COMPANY_TRIP_DETAIL(id),
  );
  return response.data;
};
