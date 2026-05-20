import axiosClient from "../axiosClient";
import type {
  UpdateUserProfilePayloadDto,
  UserProfileResponseDto,
} from "../dtos/user.payload";
import { UserEndPoints } from "../endpoints/user.endpoint";

export const getProfile = async (): Promise<UserProfileResponseDto> => {
  const response = await axiosClient.get(UserEndPoints.GET_PROFILE);
  return response.data;
};

export const updateProfile = async (
  payload: UpdateUserProfilePayloadDto,
): Promise<UserProfileResponseDto> => {
  const response = await axiosClient.patch(UserEndPoints.UPDATE_PROFILE, payload);
  return response.data;
};

// export const changePassword = async (payload: any) => {
//   const response = await axiosClient.post(UserEndPoints.CHANGE_PASSWORD, payload);
//   return response.data;
// }
