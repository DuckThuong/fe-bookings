export const BookingsEndPoints = {
  SEAT_SELECTION: (tripId: string) => `/api/bookings/seat-selection/${tripId}`,
  VALIDATE_PROMO: "/api/bookings/validate-promo",
  HOLD: "/api/bookings/hold",
  HOLD_PASSENGER: (holdId: string) => `/api/bookings/hold/${holdId}/passenger`,
  HOLD_PAY: (holdId: string) => `/api/bookings/hold/${holdId}/pay`,
  BOOKING: (bookingId: string) => `/api/bookings/${bookingId}`,
};
