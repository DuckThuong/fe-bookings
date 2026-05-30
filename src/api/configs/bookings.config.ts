import axiosClient from "../axiosClient";
import type {
  ConfirmPaymentPayload,
  CreateHoldPayload,
  CreateHoldResponse,
  HoldDraftResponse,
  PassengerPayload,
  BookingSuccessResponse,
  SeatSelectionQuery,
  SeatSelectionResponse,
  ValidatePromoPayload,
  ValidatePromoResponse,
} from "../dtos/bookings.dto";
import { BookingsEndPoints } from "../endpoints/bookings.endpoint";

export const getSeatSelectionPage = async (
  tripId: string,
  params?: SeatSelectionQuery,
): Promise<SeatSelectionResponse> => {
  const response = await axiosClient.get<SeatSelectionResponse>(
    BookingsEndPoints.SEAT_SELECTION(tripId),
    { params },
  );
  return response.data;
};

export const validatePromo = async (
  payload: ValidatePromoPayload,
): Promise<ValidatePromoResponse> => {
  const response = await axiosClient.post<ValidatePromoResponse>(
    BookingsEndPoints.VALIDATE_PROMO,
    payload,
  );
  return response.data;
};

export const createHold = async (
  payload: CreateHoldPayload,
): Promise<CreateHoldResponse> => {
  const response = await axiosClient.post<CreateHoldResponse>(
    BookingsEndPoints.HOLD,
    payload,
  );
  return response.data;
};

export const updateHoldPassenger = async (
  holdId: string,
  passenger: PassengerPayload,
): Promise<HoldDraftResponse> => {
  const response = await axiosClient.patch<HoldDraftResponse>(
    BookingsEndPoints.HOLD_PASSENGER(holdId),
    passenger,
  );
  return response.data;
};

export const confirmHoldPayment = async (
  holdId: string,
  payload: ConfirmPaymentPayload,
): Promise<BookingSuccessResponse> => {
  const response = await axiosClient.post<BookingSuccessResponse>(
    BookingsEndPoints.HOLD_PAY(holdId),
    payload,
  );
  return response.data;
};

export const getBooking = async (
  bookingId: string,
): Promise<BookingSuccessResponse> => {
  const response = await axiosClient.get<BookingSuccessResponse>(
    BookingsEndPoints.BOOKING(bookingId),
  );
  return response.data;
};
