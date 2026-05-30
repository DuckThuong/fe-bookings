import axiosClient from "../axiosClient";
import type { SearchTripsParams, SearchTripsResponse } from "../dtos/trips.dto";
import { TripsEndPoints } from "../endpoints/trips.endpoint";

export const searchTrips = async (
  params: SearchTripsParams,
): Promise<SearchTripsResponse> => {
  const response = await axiosClient.get<SearchTripsResponse>(
    TripsEndPoints.SEARCH,
    { params },
  );
  return response.data;
};
