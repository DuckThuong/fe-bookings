import {
  confirmHoldPayment,
  createHold,
  getBookingConfig,
  getBookingResult,
  getSeatMap,
  getTripContext,
  updateHoldPassenger,
  validatePromo,
} from "@/api/configs/client-booking.config";
import type {
  ConfirmPaymentDto,
  CreateHoldDto,
  PassengerDto,
  SeatMapQueryDto,
  TripContextQueryDto,
  ValidatePromoDto,
} from "@/api/dtos/client-booking.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingQueryKeys, normalizeSeatMapQuery } from "./bookingQueryKeys";

export const useBookingConfigQuery = () =>
  useQuery({
    queryKey: bookingQueryKeys.config(),
    queryFn: getBookingConfig,
    staleTime: 10 * 60 * 1000,
  });

export const useTripContextQuery = (
  payload: TripContextQueryDto,
  enabled = true,
) =>
  useQuery({
    queryKey: bookingQueryKeys.tripContext(payload.tripId),
    queryFn: () => getTripContext(payload),
    enabled: enabled && Boolean(payload.tripId),
  });

export const useSeatMapQuery = (payload: SeatMapQueryDto, enabled = true) => {
  const normalized = normalizeSeatMapQuery(payload);

  return useQuery({
    queryKey: bookingQueryKeys.seatMap(
      normalized.tripId,
      normalized.vehicleType,
      normalized.floor,
    ),
    queryFn: () => getSeatMap(normalized),
    enabled:
      enabled && Boolean(normalized.tripId) && Boolean(normalized.vehicleType),
  });
};

export const useBookingResultQuery = (bookingId: string, enabled = true) =>
  useQuery({
    queryKey: bookingQueryKeys.result(bookingId),
    queryFn: () => getBookingResult(bookingId),
    enabled: enabled && Boolean(bookingId),
  });

export const useValidatePromoMutation = () =>
  useMutation({
    mutationFn: (payload: ValidatePromoDto) => validatePromo(payload),
  });

export const useCreateHoldMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHoldDto) => createHold(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.result(response.holdId),
      });
    },
  });
};

export const useUpdateHoldPassengerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      holdId,
      payload,
    }: {
      holdId: string;
      payload: PassengerDto;
    }) => updateHoldPassenger(holdId, payload),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.result(variables.holdId),
      });
    },
  });
};

export const useConfirmHoldPaymentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      holdId,
      payload,
    }: {
      holdId: string;
      payload: ConfirmPaymentDto;
    }) => confirmHoldPayment(holdId, payload),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        bookingQueryKeys.result(response.bookingId),
        response,
      );
      queryClient.invalidateQueries({
        queryKey: bookingQueryKeys.result(variables.holdId),
      });
    },
  });
};
