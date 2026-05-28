import type {
  ClientVehicleTypeDto,
  SeatMapQueryDto,
} from "@/api/dtos/client-booking.dto";

export const bookingQueryKeys = {
  all: ["booking"] as const,
  config: () => ["booking", "config"] as const,
  tripContext: (tripId: string) => ["booking", "tripContext", tripId] as const,
  seatMap: (
    tripId: string,
    vehicleType: ClientVehicleTypeDto,
    floor: number,
  ) => ["booking", "seatMap", tripId, vehicleType, floor] as const,
  result: (bookingId: string) => ["booking", "result", bookingId] as const,
};

export const normalizeSeatMapQuery = (
  query: SeatMapQueryDto,
): Required<SeatMapQueryDto> => ({
  ...query,
  floor: query.floor ?? 1,
});
