import axiosClient from "../axiosClient";
import type {
  ClientCompanyTripDto,
  ClientCompanyTripQueryDto,
  ClientPaginatedResponseDto,
  ClientRoadDto,
  ClientRoadQueryDto,
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
): Promise<ClientPaginatedResponseDto<ClientCompanyTripDto>> => {
  const response = await axiosClient.get(ClientCatalogEndPoints.COMPANY_TRIPS, {
    params: payload,
  });
  return response.data;
};

export const getClientCompanyTrip = async (
  id: number | string,
): Promise<ClientCompanyTripDto> => {
  const response = await axiosClient.get(
    ClientCatalogEndPoints.COMPANY_TRIP_DETAIL(id),
  );
  return response.data;
};
