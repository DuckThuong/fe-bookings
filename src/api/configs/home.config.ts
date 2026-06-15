import axiosClient from "../axiosClient";
import type {
  HomeHighlightsParams,
  HomeHighlightsResponse,
} from "../dtos/home.dto";
import { HomeEndPoints } from "../endpoints/home.endpoint";

export const getHomeHighlights = async (
  params: HomeHighlightsParams,
): Promise<HomeHighlightsResponse> => {
  const response = await axiosClient.get<HomeHighlightsResponse>(
    HomeEndPoints.HIGHLIGHTS,
    { params },
  );
  return response.data;
};
