import type { ClientMyBookingQueryDto } from "@/api/dtos/client-account.dto";

export const accountQueryKeys = {
  all: ["account"] as const,
  bookings: (filters: ClientMyBookingQueryDto) =>
    ["account", "bookings", filters] as const,
  booking: (id: number | string) => ["account", "booking", id] as const,
};
