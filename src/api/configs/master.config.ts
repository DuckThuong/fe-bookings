import axiosClient from "../axiosClient";
import type { MasterPayloadDto, MasterResponseDto, MasterDataAllResponse } from "../dtos/master.dto";
import { MasterEndPoints } from "../endpoints/master.endpoint";

export const findByType = async (
  payload: MasterPayloadDto,
): Promise<MasterResponseDto> => {
  const response = await axiosClient.get(MasterEndPoints.FIND_BY_TYPE, {
    params: payload,
  });
  return response.data;
};

export const findByCode = async (
  payload: MasterPayloadDto,
): Promise<MasterResponseDto> => {
  const response = await axiosClient.get(MasterEndPoints.FIND_BY_CODE, {
    params: payload,
  });
  return response.data;
};

export const findByTypeAndCode = async (
  payload: MasterPayloadDto,
): Promise<MasterResponseDto> => {
  const response = await axiosClient.get(
    MasterEndPoints.FIND_BY_TYPE_AND_CODE,
    {
      params: payload,
    },
  );
  return response.data;
};

export const getAllStatuses = async (): Promise<MasterDataAllResponse> => {
  const response = await axiosClient.get("master-data/all-statuses");
  return response.data;
};
