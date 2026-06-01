import type { BookingSuccessResponse } from "@/api/dtos/bookings.dto";
import { BOOKING_NEXT_ACTIONS } from "../constants/booking.constants";
import type {
  BookingConfirmData,
  BookingSuccessData,
} from "../types/confirm.types";

export function toBookingSuccessData(
  api: BookingSuccessResponse,
  base: BookingConfirmData,
): BookingSuccessData {
  return {
    ...base,
    bookingId: api.bookingId,
    status: api.status,
    seats: api.seats,
    subTotal: api.pricing.subTotal,
    addonsTotal: api.pricing.addonsTotal,
    fee: api.pricing.fee,
    promoCode: api.pricing.promoCode ?? null,
    promoDiscount: api.pricing.promoDiscount,
    total: api.pricing.total,
    trip: api.trip,
    notifications: api.notifications,
    nextActions: BOOKING_NEXT_ACTIONS,
  };
}
