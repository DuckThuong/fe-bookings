import {
  getMyBooking,
  listMyBookings,
} from "@/api/configs/client-account.config";
import type { ClientMyBookingQueryDto } from "@/api/dtos/client-account.dto";
import { useQuery } from "@tanstack/react-query";
import { accountQueryKeys } from "./accountQueryKeys";

export const useMyBookingsQuery = (
  filters: ClientMyBookingQueryDto,
  enabled = true,
) =>
  useQuery({
    queryKey: accountQueryKeys.bookings(filters),
    queryFn: () => listMyBookings(filters),
    enabled,
  });

export const useMyBookingQuery = (id: number | string, enabled = true) =>
  useQuery({
    queryKey: accountQueryKeys.booking(id),
    queryFn: () => getMyBooking(id),
    enabled: enabled && Boolean(id),
  });
