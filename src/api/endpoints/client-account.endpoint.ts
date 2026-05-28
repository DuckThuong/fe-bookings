export const ClientAccountEndPoints = {
  BOOKINGS: "/client/account/bookings",
  BOOKING_DETAIL: (id: number | string) => `/client/account/bookings/${id}`,
};
