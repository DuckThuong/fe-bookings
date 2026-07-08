export const AccountEndPoints = {
  BOOKINGS: "/client/account/bookings",
  BOOKING: (id: number) => `/client/account/bookings/${id}`,
  REFUND_REQUEST: (bookingId: number) => `/client/account/bookings/${bookingId}/refund`,
};
