import axiosClient from "../axiosClient";
import type {
  ClientAccountBookingDto,
  ClientMyBookingQueryDto,
  ClientMyBookingsResponseDto,
} from "../dtos/client-account.dto";
import { ClientAccountEndPoints } from "../endpoints/client-account.endpoint";

export const listMyBookings = async (
  payload: ClientMyBookingQueryDto,
): Promise<ClientMyBookingsResponseDto> => {
  const response = await axiosClient.get(ClientAccountEndPoints.BOOKINGS, {
    params: payload,
  });
  return response.data;
};

export const getMyBooking = async (
  id: number | string,
): Promise<ClientAccountBookingDto> => {
  const response = await axiosClient.get(
    ClientAccountEndPoints.BOOKING_DETAIL(id),
  );
  return response.data;
};
