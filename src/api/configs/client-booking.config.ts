import axiosClient from "../axiosClient";
import type {
  BookingDraftResponseDto,
  BookingResultResponseDto,
  ClientBookingConfigResponseDto,
  ConfirmPaymentDto,
  CreateHoldDto,
  CreateHoldResponseDto,
  PassengerDto,
  SeatMapQueryDto,
  SeatMapResponseDto,
  TripContextQueryDto,
  TripContextResponseDto,
  ValidatePromoDto,
  ValidatePromoResponseDto,
} from "../dtos/client-booking.dto";
import { ClientBookingEndPoints } from "../endpoints/client-booking.endpoint";

export const getBookingConfig =
  async (): Promise<ClientBookingConfigResponseDto> => {
    const response = await axiosClient.get(ClientBookingEndPoints.CONFIG);
    return response.data;
  };

export const getTripContext = async (
  payload: TripContextQueryDto,
): Promise<TripContextResponseDto> => {
  const response = await axiosClient.get(ClientBookingEndPoints.TRIP_CONTEXT, {
    params: payload,
  });
  return response.data;
};

export const getSeatMap = async (
  payload: SeatMapQueryDto,
): Promise<SeatMapResponseDto> => {
  const response = await axiosClient.get(ClientBookingEndPoints.SEAT_MAP, {
    params: payload,
  });
  return response.data;
};

export const validatePromo = async (
  payload: ValidatePromoDto,
): Promise<ValidatePromoResponseDto> => {
  const response = await axiosClient.post(
    ClientBookingEndPoints.VALIDATE_PROMO,
    payload,
  );
  return response.data;
};

export const createHold = async (
  payload: CreateHoldDto,
): Promise<CreateHoldResponseDto> => {
  const response = await axiosClient.post(ClientBookingEndPoints.HOLD, payload);
  return response.data;
};

export const updateHoldPassenger = async (
  holdId: string,
  payload: PassengerDto,
): Promise<BookingDraftResponseDto> => {
  const response = await axiosClient.patch(
    ClientBookingEndPoints.HOLD_PASSENGER(holdId),
    payload,
  );
  return response.data;
};

export const confirmHoldPayment = async (
  holdId: string,
  payload: ConfirmPaymentDto,
): Promise<BookingResultResponseDto> => {
  const response = await axiosClient.post(
    ClientBookingEndPoints.HOLD_PAY(holdId),
    payload,
  );
  return response.data;
};

export const getBookingResult = async (
  bookingId: string,
): Promise<BookingResultResponseDto> => {
  const response = await axiosClient.get(
    ClientBookingEndPoints.BOOKING_DETAIL(bookingId),
  );
  return response.data;
};
