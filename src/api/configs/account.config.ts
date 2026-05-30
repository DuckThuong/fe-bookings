import axiosClient from "../axiosClient";
import type {
  AccountBookingDetail,
  AccountBookingQuery,
  AccountPaginated,
  AccountBookingItem,
} from "../dtos/account.dto";
import { AccountEndPoints } from "../endpoints/account.endpoint";

export const listMyBookings = async (
  params?: AccountBookingQuery,
): Promise<AccountPaginated<AccountBookingItem>> => {
  const response = await axiosClient.get<AccountPaginated<AccountBookingItem>>(
    AccountEndPoints.BOOKINGS,
    { params },
  );
  return response.data;
};

export const getMyBooking = async (
  id: number,
): Promise<AccountBookingDetail> => {
  const response = await axiosClient.get<AccountBookingDetail>(
    AccountEndPoints.BOOKING(id),
  );
  return response.data;
};
