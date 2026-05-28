export const ClientBookingEndPoints = {
  CONFIG: "/api/bookings/config",
  TRIP_CONTEXT: "/api/bookings/trip-context",
  SEAT_MAP: "/api/bookings/seat-map",
  VALIDATE_PROMO: "/api/bookings/validate-promo",
  HOLD: "/api/bookings/hold",
  HOLD_PASSENGER: (holdId: string) =>
    `/api/bookings/hold/${encodeURIComponent(holdId)}/passenger`,
  HOLD_PAY: (holdId: string) =>
    `/api/bookings/hold/${encodeURIComponent(holdId)}/pay`,
  BOOKING_DETAIL: (bookingId: string) =>
    `/api/bookings/${encodeURIComponent(bookingId)}`,
};
