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

export interface RefundRequestPayload {
  reason?: string;
}

export interface RefundRequestResponse {
  success: boolean;
  message: string;
  refundCode?: string;
  estimatedRefundAmount?: number;
  refundPercentage?: number;
}

export const requestRefund = async (
  bookingId: number,
  payload?: RefundRequestPayload,
): Promise<RefundRequestResponse> => {
  const response = await axiosClient.post<RefundRequestResponse>(
    AccountEndPoints.REFUND_REQUEST(bookingId),
    payload ?? {},
  );
  return response.data;
};
